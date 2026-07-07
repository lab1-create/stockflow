require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";
const liveClients = new Set();

// CONEXÃO OFICIAL COM O SEU SUPABASE
const supabaseUrl = 'https://pqznuarcwiwiodthdksv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxem51YXJjd2l3aW9kdGhka3N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzOTMwNDcsImV4cCI6MjA5ODk2OTA0N30.J2FAa-JcWJuLef6vwI7D3aGu8pwoo1VrKG_RTraHE3Q';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname)));

// Função para buscar o estado atual direto das tabelas do Supabase
async function fetchState() {
    const { data: items } = await supabase.from('items').select('*').order('code', { ascending: true });
    const { data: history } = await supabase.from('history').select('*').order('at', { ascending: false }).limit(100);
    const { data: requests } = await supabase.from('requests').select('*').order('at', { ascending: false });
    const { data: kpis } = await supabase.from('usage_kpis').select('*').order('item_code', { ascending: true });

    return {
        items: items || [],
        history: history || [],
        requests: requests || [],
        usageKpis: kpis || [],
        users: [
            { name: "Administrador", role: "admin" },
            { name: "Luiz", role: "tecnico" },
            { name: "Henrique", role: "tecnico" },
            { name: "Joao", role: "tecnico" },
            { name: "Gabriel", role: "tecnico" }
        ],
        technicians: ["Luiz", "Henrique", "Joao", "Gabriel"],
        destinations: ["Bancada 01", "Bancada 02", "Bancada 03", "Bancada 04", "Servico interno", "Estoque de testes", "Outro"],
        adminName: "Administrador"
    };
}

function broadcastState(state) {
    const payload = JSON.stringify({ type: "state", data: state });
    for (const client of liveClients) {
        client.write(`event: state\ndata: ${payload}\n\n`);
    }
}

app.get("/api/bootstrap", async (req, res, next) => {
    try {
        res.json(await fetchState());
    } catch (error) {
        next(error);
    }
});

app.post("/api/login", async (req, res) => {
    const { name, pin } = req.body;
    const users = [
        { name: "Administrador", role: "admin" },
        { name: "Luiz", role: "tecnico" },
        { name: "Henrique", role: "tecnico" },
        { name: "Joao", role: "tecnico" },
        { name: "Gabriel", role: "tecnico" }
    ];

    const user = users.find((u) => u.name.toLowerCase() === (name || "").trim().toLowerCase());
    if (!user) return res.status(400).json({ error: "Usuário não encontrado." });

    const expectedPin = user.role === "admin" ? "0000" : "1111";
    if (pin !== expectedPin) return res.status(400).json({ error: "PIN incorreto." });

    try {
        const state = await fetchState();
        res.json({ user, state });
    } catch {
        res.json({ user, state: {} });
    }
});

app.get("/api/events", (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
    });
    res.write("\n");
    liveClients.add(res);
    req.on("close", () => {
        liveClients.delete(res);
    });
});

app.post("/api/movements/withdraw", async (req, res, next) => {
    try {
        const { code, technician, destination, quantity } = req.body;

        const { data: item } = await supabase.from('items').select('*').ilike('code', code).single();
        if (!item) throw new Error("Insumo não encontrado.");

        await supabase.from('requests').insert([
            { technician, item_code: item.code, item_name: item.name, destination_name: destination, qty: quantity, status: 'pending', at: new Date().toISOString() }
        ]);

        const state = await fetchState();
        broadcastState(state);
        res.json(state);
    } catch (error) {
        next(error);
    }
});

app.post("/api/requests/:id/approve", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { data: request } = await supabase.from('requests').select('*').eq('id', id).single();
        if (!request) throw new Error("Solicitação não encontrada.");

        if (request.status !== "pending") {
            res.json(await fetchState());
            return;
        }

        await supabase.from('requests').update({ status: 'approved' }).eq('id', id);

        const { data: item } = await supabase.from('items').select('*').eq('code', request.item_code).single();
        if (item) {
            const nextQty = Math.max(0, Number(item.qty) - Number(request.qty));
            await supabase.from('items').update({ qty: nextQty }).eq('id', item.id);
        }

        await supabase.from('history').insert([
            { user_name: request.technician, user_role: 'tecnico', type: 'withdrawal', item_code: request.item_code, item_name: request.item_name, destination_name: request.destination_name, qty: request.qty, at: new Date().toISOString() }
        ]);

        const state = await fetchState();
        broadcastState(state);
        res.json(state);
    } catch (error) {
        next(error);
    }
});

app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message || "Erro interno no servidor." });
});

app.listen(port, host, () => {
    console.log(`Servidor rodando em http://${host}:${port}`);
});