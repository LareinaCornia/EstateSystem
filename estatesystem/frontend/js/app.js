// 前端

// 销售部分
// 统计信息
// 新增函数，更新销售汇总信息
async function updateSalesSummary() {
    console.log('Starting updateSalesSummary function');
    
    try {
        const response = await fetch('http://localhost:3000/api/sales/summary'); // 根据实际后端路由进行调整
        
        if (!response.ok) {
            throw new Error(`Failed to fetch sales summary data. Status: ${response.status}`);
        }

        const salesSummaryData = await response.json();

        // 更新总销售额和成交量
        const totalSalesElement = document.getElementById('totalSales');
        const totalTransactionsElement = document.getElementById('totalTransactions');
        totalSalesElement.textContent = salesSummaryData.totalsales;
        totalTransactionsElement.textContent = salesSummaryData.totaltransactions;
        
    } catch (error) {
        console.error('Error fetching or updating sales summary data:', error);
    }
}


// 在页面加载完成后调用该函数，或者按照需求的时机调用
updateSalesSummary();

// 显示销售记录录入表单
function showSalesForm() {
    const salesForm = document.getElementById('salesForm');
    salesForm.style.display = 'block';
}

// 隐藏销售记录录入表单
function hideSalesForm() {
    const salesForm = document.getElementById('salesForm');
    salesForm.style.display = 'none';
}


// 保存销售记录到数据库
async function saveSalesRecord() {
    const eid = document.getElementById('eid').value;
    const cid = document.getElementById('cid').value;
    const saledate = document.getElementById('saledate').value;
    const price = document.getElementById('price').value;

    try {
        const response = await fetch('http://localhost:3000/api/sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ eid, cid, saledate, price }),
        });

        if (response.ok) {
            // 数据保存成功，可以执行其他操作
            console.log('Record saved successfully');
            hideSalesForm(); // 隐藏表单
        } else {
            const errorMessage = await response.json();
            alert(errorMessage.error); // 在网页上弹出错误提示
            console.error('Failed to save record:', errorMessage);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function hideSalesTable() {
    // 隐藏表格
    const tableContainer = document.getElementById('salesTableContainer');
    tableContainer.innerHTML = '';
}


async function showSalesTable() {
    try {
        const response = await fetch('http://localhost:3000/api/sales');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch sales data. Status: ${response.status}`);
        }

        const salesData = await response.json();

        
        const tableContainer = document.getElementById('salesTableContainer');
        tableContainer.innerHTML = generateSalesTable(salesData);

        
        
    } catch (error) {
        console.error('Error fetching or processing sales data:', error);
        // 显示错误信息给用户或执行其他错误处理逻辑
    }
}


function generateSalesTable(data) {
    // 根据销售记录数据生成表格的 HTML
    // 使用模板字符串和数组的 map 方法更清晰和灵活
   const tableHTML = `
        <h2 style="font-size: smaller; color: gray;">截至目前时分，房地产销售总记录如下：</h2>
        <table style="border-collapse: collapse; width: 60%; margin: auto;">
            <thead>
                <tr style="border: 1px solid #ddd; background-color: #f2f2f2;">
                    <th style="border: 1px solid #ddd; padding: 5px;">楼盘编号</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">顾客编号</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">销售日期</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">成交价格</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(record => `
                    <tr style="border: 1px solid #ddd;">
                        <td style="border: 1px solid #ddd; padding: 8px;">${record.eid}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${record.cid}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${record.saledate}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${record.price}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="button" style="margin-top: 20px; text-align: center;">
            <button type="button" id="recordSaleBtn" onclick="hideSalesTable()">返回</button>
        </div>
    </div>
    `;
    return tableHTML;
}







// 显示楼盘信息添加表单
function showEstatesForm() {
    const estatesForm = document.getElementById('estatesForm');
    estatesForm.style.display = 'block';
}

// 隐藏楼盘信息添加表单
function hideEstatesForm() {
    const estatesForm = document.getElementById('estatesForm');
    estatesForm.style.display = 'none';
}

// 保存楼盘记录到数据库
async function saveEsatesRecord() {
    const eeid = String(document.getElementById('eeid').value);
    const ename = document.getElementById('ename').value;
    const address = document.getElementById('address').value;

   

    console.log('Request body:', JSON.stringify({ eeid, ename, address }));

   
    try {
        const response = await fetch('http://localhost:3000/api/estates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ eeid, ename, address }),
        });

        if (response.ok) {
            // 数据保存成功，可以执行其他操作
            console.log('Record saved successfully');
            hideEstatesForm(); // 隐藏表单
        } else {
            const errorMessage = await response.json();
            alert(errorMessage.error); // 在网页上弹出错误提示
            console.error('Failed to save record:', errorMessage);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function hideEstatesTable() {
    // 隐藏表格
    const tableContainer = document.getElementById('estatesTableContainer');
    tableContainer.innerHTML = '';
}


async function showEstatesTable() {
    try {
        const response = await fetch('http://localhost:3000/api/estates');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch estates data. Status: ${response.status}`);
        }

        const estatesData = await response.json();

        const tableContainer = document.getElementById('estatesTableContainer');
        tableContainer.innerHTML = generateEstatesTable(estatesData);
    } catch (error) {
        console.error('Error fetching or processing estates data:', error);
    }
}

function generateEstatesTable(data) {
    const tableHTML = `
        <h2 style="font-size: smaller; color: gray;">截至目前时分，楼盘建设情况如下：</h2>
        <table style="border-collapse: collapse; width: 60%; margin: auto;">
            <thead>
                <tr style="border: 1px solid #ddd; background-color: #f2f2f2;">
                    <th style="border: 1px solid #ddd; padding: 5px;">楼盘编号</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">楼盘名称</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">楼盘地址</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(record => `
                    <tr style="border: 1px solid #ddd;">
                        <td style="border: 1px solid #ddd; padding: 8px;">${record.eid}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${record.ename}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${record.address}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="button" style="margin-top: 20px; text-align: center;">
            <button type="button" id="recordSaleBtn" onclick="hideEstatesTable()">返回</button>
        </div>
    </div>
    `;
    return tableHTML;
}



// 显示楼盘信息添加表单
function showCostumersForm() {
    const costumersForm = document.getElementById('costumersForm');
    costumersForm.style.display = 'block';
}

// 隐藏楼盘信息添加表单
function hideCostumersForm() {
    const costumersForm = document.getElementById('costumersForm');
    costumersForm.style.display = 'none';    
}


// 显示修改顾客信息表单
function showModifyCostumersForm() {
    const modifyCostumersForm = document.getElementById('modifyCostumersForm');
    modifyCostumersForm.style.display = 'block';
}

// 确认修改顾客信息
async function confirmModifyCostumers() {
    const modifyCid = document.getElementById('modifyCid').value;

    // 显示剩下表项
    const costumersForm = document.getElementById('costumersForm');
    costumersForm.style.display = 'block';


    // 显示确认按钮和取消按钮
    const confirmModifyBtn = document.getElementById('confirmModifyBtn');
    const cancelModifyBtn = document.getElementById('cancelModifyBtn');
    confirmModifyBtn.style.display = 'block';
    cancelModifyBtn.style.display = 'block';
}

// 取消修改顾客信息操作
function cancelModifyCostumers() {
    const modifyCostumersForm = document.getElementById('modifyCostumersForm');
    modifyCostumersForm.style.display = 'none';

    // 隐藏剩下表项
    const costumersForm = document.getElementById('costumersForm');
    costumersForm.style.display = 'none';

    // 隐藏确认按钮和取消按钮
    const confirmModifyBtn = document.getElementById('confirmModifyBtn');
    const cancelModifyBtn = document.getElementById('cancelModifyBtn');
    confirmModifyBtn.style.display = 'none';
    cancelModifyBtn.style.display = 'none';
}









// 新增函数，显示修改楼盘表单
function showModifyEstateForm() {
    const modifyEstateForm = document.getElementById('modifyEstateForm');
    modifyEstateForm.style.display = 'block';
}

// 新增函数，确认修改楼盘信息
async function confirmModifyEstate() {
    const modifyEid = document.getElementById('modifyEid').value;

    // 可以根据 modifyEid 查询数据库获取相关信息并填充表单

    // 显示剩下两个表项
    const estatesForm = document.getElementById('estatesForm');
    estatesForm.style.display = 'block';

    // 可以根据需要设置其他表单项的值

    // 显示确认按钮和取消按钮
    const confirmModifyBtn = document.getElementById('confirmModifyBtn');
    const cancelModifyBtn = document.getElementById('cancelModifyBtn');
    confirmModifyBtn.style.display = 'block';
    cancelModifyBtn.style.display = 'block';
}

// 新增函数，取消修改楼盘操作
function cancelModifyEstate() {
    const modifyEstateForm = document.getElementById('modifyEstateForm');
    modifyEstateForm.style.display = 'none';

    // 隐藏剩下两个表项
    const estatesForm = document.getElementById('estatesForm');
    estatesForm.style.display = 'none';

    // 隐藏确认按钮和取消按钮
    const confirmModifyBtn = document.getElementById('confirmModifyBtn');
    const cancelModifyBtn = document.getElementById('cancelModifyBtn');
    confirmModifyBtn.style.display = 'none';
    cancelModifyBtn.style.display = 'none';
}
















// 保存顾客记录到数据库
async function saveCostumersRecord() {
    const ccid = document.getElementById('ccid').value;
    const cname = document.getElementById('cname').value;
    const phone = document.getElementById('phone').value;
    const sex = document.getElementById('sex').value;
    const age = document.getElementById('age').value;
   
    try {
        const response = await fetch('http://localhost:3000/api/costumers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ccid, cname, phone, sex, age }),
        });

        if (response.ok) {
            // 数据保存成功，可以执行其他操作
            console.log('Record saved successfully');
            hideCostumersForm(); // 隐藏表单
        } else {
            const errorMessage = await response.json();
            alert(errorMessage.error); // 在网页上弹出错误提示
            console.error('Failed to save record:', errorMessage);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



function hideCostumersTable() {
    // 隐藏表格
    const tableContainer = document.getElementById('costumersTableContainer');
    tableContainer.innerHTML = '';
}


async function showCostumersTable() {
    try {
        const response = await fetch('http://localhost:3000/api/costumers');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch estates data. Status: ${response.status}`);
        }

        const costumersData = await response.json();

        const tableContainer = document.getElementById('costumersTableContainer');
        tableContainer.innerHTML = generateCostumersTable(costumersData);
    } catch (error) {
        console.error('Error fetching or processing costumers data:', error);
    }
}

function generateCostumersTable(data) {
    const tableHTML = `
        <h2 style="font-size: smaller; color: gray;">截至目前时分，顾客信息统计如下：</h2>
        <table style="border-collapse: collapse; width: 60%; margin: auto;">
            <thead>
                <tr style="border: 1px solid #ddd; background-color: #f2f2f2;">
                    <th style="border: 1px solid #ddd; padding: 5px;">顾客编号</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">顾客姓名</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">电话号码</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">顾客性别</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">顾客年龄</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(record => `
                    <tr style="border: 1px solid #ddd;">
                        <td style="border: 1px solid #ddd; padding: 8px;">${record.cid}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${record.cname}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${record.phone}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${record.sex}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${record.age}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="button" style="margin-top: 20px; text-align: center;">
            <button type="button" id="recordSaleBtn" onclick="hideCostumersTable()">返回</button>
        </div>
    </div>
    `;
    return tableHTML;
}
