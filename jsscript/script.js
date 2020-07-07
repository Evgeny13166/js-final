const companyStructure = [
    {
        id: 3,
        name: "Development Managment",
        parent_id: null,
    },
    {
        id: 2,
        name:"Lead developers",
        parent_id: 3,
    },
    {
        id: 1,
        name: "Developers",
        parent_id: 2,
    },
    {
        id: 6,
        name: "Quality Assarance Management",
        parent_id: null,
    },
    {
        id: 5,
        name:"Lead QA",
        parent_id: 6,
    },
    {
        id: 4,
        name: "Tester",
        parent_id: 5, 
    }

];

const workers = [
    {
        id: 0,
        name: "Yurik Devman" ,
        dept_id: 1,
        tel: "125-789-85",
        salary: 3000,
    },
    {
        id: 1,
        name: "Dima Leaddev",
        dept_id: 2,
        tel: "235-658-95",
        salary:2000,
    },
    {
        id: 2,
        name: "Julya Leaddev",
        dept_id: 2,
        tel: "178-789-85",
        salary: 1000, 
    },
    {
        id: 3,
        name: "Misha Dev",
        dept_id: 3,
        tel: "178-669-85",
        salary: 9000, 
    },
/*====*/
    
    {
        id: 5,
        name: "DanikHeadman",
        dept_id: 6,
        tel: "123-123-33",
        salary: 3000
    },
    {
        id: 6,
        name: "KoliaLead",
        dept_id: 5,
        tel: "123-123-3",
        salary: 2000
    },
    {
        id: 7,
        name: "OliaLead3",
        dept_id: 5,
        tel: "123-123-3",
        salary: 2200
    },
    {
        id: 8,
        name: "SienaTest",
        dept_id: 4,
        tel: "123-123-3",
        salary: 1000
    },
{
        id: 9,
        name: "LenaTest",
        dept_id: 4,
        tel: "123-123-3",
        salary: 1200
    },
    {
        id: 4,
        name: "IraTest",
        dept_id: 4,
        tel: "123-123-3",
        salary: 1000
    }
];

/*===================дерево отделов======================*/
function  getItemsTree (arr) {
    for( let i = 0; i < arr.length; i++) {
        const potentialSubdivision = arr[i];

        for ( let j = 0; j < arr.length; j++){
            const departament = arr[j];

            if(departament.id === potentialSubdivision.parent_id){
                if(!departament.subdivision){
                    departament.subdivision = [];
                }
                departament.subdivision.push(potentialSubdivision);
            }
        }
    }
    return arr.filter( item => item.parent_id === null);
};
const itemsTree =  getItemsTree(companyStructure);

/*================Список отделов=========================*/


const depList = document.getElementById('dep_list');

buildDOMTree(itemsTree, depList);

function buildDOMTree(items, supportEl){
    const ulEl = document.createElement('ul');
    ulEl.addEventListener('click', ev =>{
        if(ev.target.nodeName ==='SPAN'){
            const deptId = +ev.target.getAttribute('data-dept-id');

            const filterWorker = workers.filter(worker => deptId === worker.dept_id);

            buildTable(filterWorker);
        }
    });
    createHTMLTree(items, ulEl);
    
    supportEl.appendChild(ulEl);

};

function createHTMLTree(items, rootEl){
    items.forEach (item =>{
        const liEl = document.createElement('li');


        liEl.innerHTML = `<i class="fa fa-caret-right"></i><span data-dept-id="${item.id}">${item.name}</span>`; //cоздание каретки
        rootEl.appendChild(liEl);
        
        if(item.subdivision){
        const childrenUl = document.createElement('ul');
        liEl.appendChild(childrenUl);
        createHTMLTree(item.subdivision, childrenUl);
        }
    });
}




/*====================Создание таблицы============*/

function clearTable(){
    const tableEl = document.getElementsByTagName('table')[0];
    const tbodyEl = tableEl.getElementsByTagName('tbody')[0];

    if(!tbodyEl){
        return;
    }
    tableEl.removeChild(tbodyEl);
}




function buildTable(items){
    clearTable();
    fillTable(items);

    function fillTable (items){
        const tbodyEl = document.createElement('tbody');
        const keys = ['id','name','tel','salary'];

        items.forEach(item => {
            const trEl = document.createElement('tr');

            keys.forEach(key =>{
                const tdEl = document.createElement('td'); 
                if (key === 'salary'){
                    tdEl.setAttribute('data-salary-work-orig', item.salary);
                }

                tdEl.innerText = item[key];

                trEl.appendChild(tdEl);

            });
            tbodyEl.appendChild(trEl);
        }) ;

        const tableEl = document.getElementsByTagName('table')[0];
        tableEl.append(tbodyEl);
    }
}

/*===================Курс валют====================*/
document.getElementById('curr-sel').addEventListener('change', async ev =>{
    const currId = ev.target.value;
    const currData = await fetchCurrencyById(currId);
    console.log(currData);

    const tableSalaryItems = document.querySelectorAll('td[data-salary-work-orig]');

    if (!tableSalaryItems) {
        return;
    }

    for (let i = 0; i < tableSalaryItems.length; i++) {
        const originalSalaryCount = +tableSalaryItems[i].getAttribute('data-salary-work-orig');
        tableSalaryItems[i].innerText = (originalSalaryCount / currData.Cur_OfficialRate).toFixed(2);
    }

})

const currCache = {};


function fetchCurrencyById(id){
    if(!currCache[id]){
        currCache[id] = fetch(`https://www.nbrb.by/api/exrates/rates/${id}`).then(data => data.json())
    }
    return currCache[id];
}



/*=================================кнопка очистить=========*/
document.getElementById("clear").addEventListener("click", function(){
    clearTable()
})