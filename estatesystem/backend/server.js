const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const app = express();

// 跨域设置
const cors = require('cors');
app.use(cors());

//  静态文件服务
app.use(express.static('frontend'));

const PORT = 3000;

// 创建一个 PostgreSQL 数据库连接池
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'estate',
    password: '20030808',
    port: 5432,
});

app.use(bodyParser.json());



// 统计
// 获取销售汇总信息的路由
app.get('/api/sales/summary', async (req, res) => {
    try {
        const result = await pool.query('SELECT SUM(price) as totalSales, COUNT(*) as totalTransactions FROM sales');
        const salesSummaryData = result.rows[0];

        console.log('Sales Summary Data:', salesSummaryData); // 添加这行用于调试

        res.status(200).json(salesSummaryData);
    } catch (error) {
        console.error('Error fetching sales summary data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// 处理保存销售记录的路由
app.post('/api/sales', async (req, res) => {
    const { eid, cid, saledate, price } = req.body;

    try {
        // // 验证外键约束
        // const isEstateValid = await isForeignKeyValid('estates', 'eid', eid);
        // const isCostumerValid = await isForeignKeyValid('costumers', 'cid', cid);

        // if (!isEstateValid) {
        //     return res.status(400).json({ error: 'Invalid estate ID' });
        // }

        // if (!isCostumerValid) {
        //     return res.status(400).json({ error: 'Invalid costumer ID' });
        // }

        // 使用连接池执行 SQL 查询
        const result = await pool.query(
            'INSERT INTO sales (eid, cid, saledate, price) VALUES ($1, $2, $3, $4)',
            [eid, cid, saledate, price]
        );

        res.status(201).json({ message: 'Record saved successfully' });
    } catch (error) {
        console.error('Error saving record:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// 获取所有销售记录的路由
app.get('/api/sales', async (req, res) => {
    try {
        // 使用连接池执行 SQL 查询
        const result = await pool.query('SELECT * FROM sales');
        const salesData = result.rows;

        res.status(200).json(salesData);
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// 处理保存楼盘记录的路由
app.post('/api/estates', async (req, res) => {
    const { eeid, ename, address } = req.body;


    try {
        // 检查是否已经存在相同的楼盘编号、楼盘名称或地址
        // const isEstateExists = await isDuplicateEstate(eid, ename, address);

        // if (isEstateExists) {
        //     return res.status(400).json({ error: 'Estate with the same ID, name, or address already exists' });
        // }

        // 使用连接池执行 SQL 查询
        const result = await pool.query(
            'INSERT INTO estates (eid, ename, address) VALUES ($1, $2, $3)',
            [eeid, ename, address]
        );

        res.status(201).json({ message: 'Estate record saved successfully' });
    } catch (error) {
        console.error('Error saving estate record:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 检查是否已经存在相同的楼盘编号、楼盘名称或地址
async function isDuplicateEstate(eid, ename, address) {
    try {
        const result = await pool.query(
            'SELECT 1 FROM estates WHERE eid = $1 OR ename = $2 OR address = $3',
            [eid, ename, address]
        );

        return result.rows.length > 0;
    } catch (error) {
        console.error('Error checking duplicate estate:', error);
        return false;
    }
}

// 楼盘信息修改路由
app.put('/api/estates/:eid', async (req, res) => {
    const { eid } = req.params;
    const { ename, address } = req.body;

    try {
        // 检查楼盘是否存在
        const isEstateExists = await isForeignKeyValid('estates', 'eid', eid);

        if (!isEstateExists) {
            return res.status(400).json({ error: 'Invalid estate ID' });
        }

        // 使用连接池执行 SQL 更新
        const result = await pool.query(
            'UPDATE estates SET ename = $1, address = $2 WHERE eid = $3',
            [ename, address, eid]
        );

        res.status(200).json({ message: 'Estate record updated successfully' });
    } catch (error) {
        console.error('Error updating estate record:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 获取所有楼盘记录的路由
app.get('/api/estates', async (req, res) => {
    try {
        // 使用连接池执行 SQL 查询
        const result = await pool.query('SELECT * FROM estates');
        const estatesData = result.rows;

        res.status(200).json(estatesData);
    } catch (error) {
        console.error('Error fetching estates data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// 处理保存顾客记录的路由
app.post('/api/costumers', async (req, res) => {
    const { ccid, cname, phone, sex, age } = req.body;

    try {
        // 检查是否已经存在相同的顾客编号或电话号码
        const isCostumerExists = await isDuplicateCostumer(ccid, phone);

        if (isCostumerExists) {
            return res.status(400).json({ error: 'Costumer with the same ID or phone number already exists' });
        }

        // 检查性别是否合法
        if (!(sex === '女' || sex === '男')) {
            return res.status(400).json({ error: 'Invalid gender. Please use "女" or "男".' });
        }

        // 检查年龄是否合法
        if (age <= 18) {
            return res.status(400).json({ error: 'Invalid age. Age must be greater than 18.' });
        }

        // 使用连接池执行 SQL 查询
        const result = await pool.query(
            'INSERT INTO costumers (cid, cname, phone, sex, age) VALUES ($1, $2, $3, $4, $5)',
            [ccid, cname, phone, sex, age]
        );

        res.status(201).json({ message: 'Costumer record saved successfully' });
    } catch (error) {
        console.error('Error saving costumer record:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// 获取所有顾客记录的路由
app.get('/api/costumers', async (req, res) => {
    try {
        // 使用连接池执行 SQL 查询
        const result = await pool.query('SELECT * FROM costumers');
        const costumerData = result.rows;

        res.status(200).json(costumerData);
    } catch (error) {
        console.error('Error fetching costumer data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

