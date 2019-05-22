let studentsList = []; // 用于临时存数据的数组
function getStudents() {

    //FetchAPI
    //Fetch always return Promise with resolve
    fetch('http://localhost:3000/contacts').then(response => { // 从json-server/contacts得到数据，然后放进response中
        //console.log(response);
        if (response.ok) {
            // console.log(response.json()); // 如果response.ok为真，即返回数据存在且状态ok，返回数据
            return response.json();

        } else { // 处理response报文为404、500、401时的情况，进行提示。
            if (response.status == 404) {
                return Promise.reject(new Error('InValid URL..'))
            } else if (response.status == 500) {
                return Promise.reject(new Error('Some Internal Error Occured...'));
            } else if (response.status == 401) {
                return Promise.reject(new Error('UnAuthorized User..'));
            }
        }

    }).then(studentsListResponse => { // 得到数据成功，则将值赋给studentsList对象，并调用displayResposToHTML函数来显示数据。
        studentsList = studentsListResponse;
        // console.log('studentsList', studentsList);
        displayReposToHTML(studentsListResponse);
    }).catch(error => {
        let errorEle = document.getElementById('errMessage'); // 得到数据失败，则在ID为errMessage的元素里显示错误信息。
        errorEle.innerText = error.message;
    })

}


function displayReposToHTML(studentsListResponse) {
    //logic
    // console.log('Response', repositoriesList);
    // let tableEle =  document.getElementById('repo-list-table');
    let tableEle = document.getElementsByTagName('table')[0]; // 得到html中的table元素

    let tbodyEle = tableEle.getElementsByTagName('tbody')[0]; // 得到html中的table元素的body
    //console.log(tbodyEle);
    let tbodyEleInnerHTMLString = ''; // 准备填充到table body元素里的html字符串

    studentsListResponse.forEach(student => {
        //     console.log(repo.web_url + '--'+repo.owner.username );
        tbodyEleInnerHTMLString += ` 
                <tr>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.contactno}</td>
                    <td><button class='btn btn-primary' onclick='updateStudent(${student.id})'>Update</button></td>
                    <td ><i class='fa fa-trash' style='color:red;font-size:1.2em;cursor:pointer' onclick='deleteStudent(${student.id})'></i></td>
                    </tr>
     `; // 将每一个studentListResponse中的元素，写入html语句，等待Ajax插入 | 将在这里将更新的Update函数插入。
    });

    tbodyEle.innerHTML = tbodyEleInnerHTMLString; // 将修改后的html语句插入table body


}


// update student to db according to id
function updateStudent(id) {
    // receive a id number, then give a form to input info
    //logic
    // console.log('Response', repositoriesList);
    // let tableEle =  document.getElementById('repo-list-table');
    let tableEle = document.getElementsByTagName('table')[0]; // 得到html中的table元素

    let tbodyEle = tableEle.getElementsByTagName('tbody')[0]; // 得到html中的table元素的body
    //console.log(tbodyEle);
    let tbodyEleInnerHTMLString = ''; // 准备填充到table body元素里的html字符串

    studentsList.forEach(student => {
        if (student.id != id) {
            //     console.log(repo.web_url + '--'+repo.owner.username );
            tbodyEleInnerHTMLString += ` 
            <tr>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.contactno}</td>
                <td><button class='btn btn-primary' onclick='updateStudent(${student.id})'>Update</button></td>
                <td ><i class='fa fa-trash' style='color:red;font-size:1.2em;cursor:pointer' onclick='deleteStudent(${student.id})'></i></td>
                </tr>
                `; // 将每一个studentListResponse中的元素，写入html语句，等待Ajax插入 | 将在这里将更新的Update函数插入。
        } else {
            tbodyEleInnerHTMLString += ` 
            <tr>
                <td><input type="text" class="form-control" id="updateName" placeholder="Name"></td>
                <td><input type="text" class="form-control" id="updateEmail" placeholder="Email"></td>
                <td><input type="text" class="form-control" id="updateContactno" placeholder="Contact number"></td>
                <td><button class='btn btn-primary' onclick='submitUpdate(${student.id})'>Confirm</button></td>
                <td ><i class='fa fa-trash' style='color:red;font-size:1.2em;cursor:pointer' onclick='deleteStudent(${student.id})'></i></td>
                </tr>
                `; // 将对应表项展示成输入框
        }
    });
    tbodyEle.innerHTML = tbodyEleInnerHTMLString; // 将修改后的html语句插入table body
}

// submit update
function submitUpdate(id) {
    let name = document.getElementById('updateName').value;
    let email = document.getElementById('updateEmail').value;
    let contactno = document.getElementById('updateContactno').value;

    let student = { // 组装变量成为一个json变量
        name: name,
        email: email,
        contactno: contactno
    };
    // console.log('updateStudent -->', student);
    fetch(`http://localhost:3000/contacts/${id}`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(student)
    }).then(response => {
        if (response.ok) { // 返回报文ok，即返回json继续处理
            return response.json();
        } else {
            return Promise.reject(new Error('Some internal error occured...')) // fetch 的返回总是solve，所以要在检查ok与否后，手动reject
        }
    }).then(updatedStudent => {
        console.log('updatedStudent -->', updatedStudent);
        studentsList.splice(studentsList.findIndex(studentjson => studentjson.id == id), 1, updatedStudent); // 通过id在list里查到索引
        displayReposToHTML(studentsList);
    })
}

//adding student to db
function addStudent(event) { // 这个函数会在html中的form表单的button被按下的时候触发，然后传入一个event参数。
    event.preventDefault(); // 如果调用这个方法，默认事件行为将不再触发。
    //  console.log('addStudent');
    let name = document.getElementById('name').value; // 这三行语句将上面的addStudent的form中的信息读入变量。
    let email = document.getElementById('email').value;
    let contactno = document.getElementById('contactno').value;

    let student = { // 组装变量成为一个json变量
        name: name,
        email: email,
        contactno: contactno
    }

    // console.log(name + ' --' + email + " ---" + contactno);
    fetch('http://localhost:3000/contacts', { // 使用fetch发送POST请求。
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(student) // 在http报文里，json也要stringify
    }).then(response => {
        if (response.ok) { // 返回报文ok，即返回json继续处理
            return response.json();
        } else {
            return Promise.reject(new Error('Some internal error occured...')) // fetch 的返回总是solve，所以要在检查ok与否后，手动reject
        }
    }).then(addedStudent => {
        console.log('addedStudent -->', addedStudent);
        //   let tableEle = document.getElementsByTagName('table')[0];

        //   let tbodyEle = tableEle.getElementsByTagName('tbody')[0];

        //   console.log(tbodyEle.innerHTML);
        let tbodyEle = document.getElementById('table-body'); // 得到table body的元素，然后可以向其中加入新行

        studentsList.push(addedStudent); // 将返回值加入list
        displayReposToHTML(studentsList); // 然后渲染

    }).catch(error => {
        //ADd this to html
        let errorEle = document.getElementById('errMessage'); // 如果fetch失败直接提示错误信息
        errorEle.innerText = error.message;
    })
}

function deleteStudent(id) {
    console.log('delete Student--', id);

    fetch(`http://localhost:3000/contacts/${id}`, { // 使用fetch发送delete请求
            method: 'DELETE'
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(result => {
            console.log('result from delete', result);
            console.log(studentsList);
            // console.log('deleted item:', studentsList.findIndex(studentjson => studentjson.id == id));
            studentsList.splice(studentsList.findIndex(studentjson => studentjson.id == id), 1); // 通过id在list里查到索引
            displayReposToHTML(studentsList); // 根据索引删掉对应表项
            //write the code for DOM manipulation
        })
        // location.reload(); // 用location.reload刷新页面。实际上，这个地方更好的是仅刷新table的DOM树，重新读数据，并渲染。但挺麻烦的，对于一个作业来说。

}