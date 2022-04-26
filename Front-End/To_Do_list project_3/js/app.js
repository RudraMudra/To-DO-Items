//add an eventListener to the from
const form = document.querySelector('#itemForm'); // select form
const itemInput = document.querySelector('#itemInput'); // select input box from form
const itemStatus = document.querySelector('#itemStatus'); //select status box from form
const itempriority =  document.querySelector('#itempriority'); 
const itempriorityHigh =  document.querySelector('#itemPriorityHigh'); 
const itempriorityLow =  document.querySelector('#itemPriorityLow'); 
const ItemCheckbox = document.querySelector('#ItemCheckbox');
const bAType = document.querySelector('#bAType');
const pAType = document.querySelector('#pAType');
const cAType = document.querySelector('#cAType');
// var itemPriorityData =  document.querySelector('#itemPriorityData'); 
const itemList = document.querySelector('.item-list');
const feedback = document.querySelector('.feedback');
const clearButton = document.querySelector('#clear-list');
let isEdit = false;
let selectedItemId;

let todoItems = [];

const handleItem = function (todoItems) {

    const items = itemList.querySelectorAll('.item-list');


    items.forEach(function (item) {
        i = 0;
        const name = item.querySelector('.item-name');
     //   if (item.querySelector('.item-name').textContent === itemName[1]) {
            //complete event listener
            item.querySelector('.complete-item').addEventListener('click', function () {
                item.querySelector('.item-name').classList.toggle('completed');
                this.classList.toggle('visibility');
            });
            //edit event listener
            item.querySelector('.edit-item').addEventListener('click', function(){
                itemInput.value = name.textContent;
                itemStatus.value = item.querySelector('.item-status').textContent;
                if (item.querySelector('.item-priority').textContent === 'High') {
                    $("#itemPriorityHigh").prop("checked", true);
                } else {
                    $("#itemPriorityLow").prop("checked", true);
                }

                if(item.querySelector('.item-activity').textContent.includes('Professional')){
                    $("#pAType").prop("checked", true);
                }  
                if(item.querySelector('.item-activity').textContent.includes('Commercial')) {
                    $("#cAType").prop("checked", true);
                }
                if(item.querySelector('.item-activity').textContent.includes('Business')){
                    ($("#bAType").prop("checked", true));
                }
                // } else if(item.querySelector('.item-activity').textContent.includes('Business', 'Professional')){
                //     ($("#bAType").prop("checked", true));
                //     ($("#pAType").prop("checked", true));
                // }
                // else{
                //     $("$("bAType").prop("checked", true));").prop("checked", true);
                // }
                // itempriority.value = itemName[4];
                // item_activityType.value = itemName[5];
                isEdit = true;

                filteredItem = todoItems.filter(function getItemId(item) {
                    return item['todo'] === name.textContent;
                  });
                selectedItemId =  filteredItem[0].itemId;

            });
            // delete event listener
            item.querySelector('.delete-item').addEventListener('click', function () {
                debugger;
                const options = {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                };

                fetch('http://localhost:5000/deleteItem/' + name.textContent, options)
                    .then(function (response) {
                        return response.json();
                    }).then(function (response) {
                        fetch('http://localhost:5000/getAllList')
                            .then(function (response) {
                                return response.json();
                            }).then(function (response) {
                                getList(response);
                                console.log('GET response:' + response);
                            });
                    });
            })
       // }
       i++;
    })
}

const removeItem = function (item) {
    console.log(item);
    const removeIndex = (todoItems.indexOf(item));
    console.log(removeIndex);
    todoItems.splice(removeIndex, 1);
}

const getList = function (todoItems) {
    itemList.innerHTML = '';

   // JSON.parse(todoItems).forEach(function(item) {
      
        itemList.insertAdjacentHTML('beforeend',`<table id='table'>
        <tr>
            <th>ToDo</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Activity</th>
            <th>Actions</th>
        <tr>
        `);
        var todo_items = '';

        JSON.parse(todoItems).forEach(function(item){
            todo_items += '<tr class="item-list">';
            todo_items += '<td class="item-name">' + 
                item.todo + '</td>';
            
            todo_items += '<td class="item-status">' + 
                item.status + '</td>';
            
            todo_items += '<td class="item-priority">' + 
                item.priority + '</td>';
            
            todo_items += '<td class="item-activity">' + 
                item.activity + '</td>';
            
          //  todo_items += '</tr>';
            todo_items += `
             <td>
            <div class="item-icons">
            <a href="#" class="complete-item mx-2 item-icon">
            <i class="far fa-check-circle"></i></a>
            <a href="#" class="edit-item mx-2 item-icon">
            <i class="far fa-edit"></i></a>
            <a href="#" class="delete-item item-icon">
            <i class="far fa-times-circle">
            </i></a></div> </td></tr>`
           
       });
        $('#table').append(todo_items);
        handleItem(JSON.parse(todoItems));
}

const getLocalStorage = function () {

    const todoStorage = localStorage.getItem('todoItems');
    if (todoStorage === 'undefined' || todoStorage === null) {
        todoItems = [];
    } else {
        todoItems = JSON.parse(todoStorage);
        getList(todoItems);
    }
}

const setLocalStorage = function (todoItems) {
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
}

const getAllList = function () {
    fetch('http://localhost:5000/getAllList')
        .then(function (response) {
            return response.json();
        }).then(function (response) {
            todoItems.push(response);
            console.log('GET response:' + response);
            getList(todoItems);
        });
}

getAllList();

//add an item to the List, including to local storage
form.addEventListener('submit', function (e) {
    e.preventDefault();
    const itemName = itemInput.value;
    const status = itemStatus.value;
    var item_priority = itempriority.value;
    // var item_activityType = item_activityType;
    var item_activityType = [];

    var priorities = document.getElementsByName('itemPriority');

    for (let priority of priorities) {

        if (priority.checked) {
            console.log(priority.value);
            item_priority = priority.value;
        }

    }

    var activityTypes = document.getElementsByName('aType');

    for (let activityType of activityTypes) {

        if (activityType.checked) {
            console.log(activityType.value);
            item_activityType.push(activityType.value);
        }
    }
    console.log("Activity type:" + item_activityType)


    if (itemName.length === 0) {
        feedback.innerHTML = 'Please Enter Valid Value';
        feedback.classList.add('showItem', 'alert-danger');
        setTimeout(
            function () {
                feedback.classList.remove('showItem');
            }, 3000);
    } else {
        if(isEdit) {
            const editListValue = {
                list_name: itemName,
                status_field: status,
                item_priority: item_priority,
                item_activityType: item_activityType
            };
            const editOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editListValue),
            };
            console.log(editOptions);

            fetch('http://localhost:5000/updateEntry/' + selectedItemId, editOptions)
            .then(function(response){
                return response.json();
            }).then(function(response){
                fetch('http://localhost:5000/getAllList')
                .then(function(response){
                    return response.json();
                }).then(function(response){
                    getList(response);
                    console.log('GET response:' + response);
                });
            });
            isEdit = false;
        } else {
        const listValue = {
            list_name: itemName,
            is_checked: 0,
            status_field: status,
            item_priority: item_priority,
            item_activityType: item_activityType

        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(listValue),
        };

        fetch('http://localhost:5000/create', options)
            .then(function (response) {
                return response.json();
            }).then(function (text) {
                //   todoItems.push(itemName);
                console.log('GET response:' + text);

                fetch('http://localhost:5000/getAllList')
                    .then(function (response) {
                        return response.json();
                    }).then(function (response) {
                        getList(response);
                        console.log('GET response:' + text);
                    });
            });
        }
    }   

    itemInput.value = '';
    itemStatus.value = '';
    $("#itemPriorityHigh").prop("checked", false);
    $("#itemPriorityLow").prop("checked", false);
    $("#pAType").prop("checked", false);
    $("#bAType").prop("checked", false);
    });

//clear all items from the list
clearButton.addEventListener('click', function () {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    fetch('http://localhost:5000/deleteAll', options)
        .then(function (response) {
            return response.json();
        }).then(function (response) {
            fetch('http://localhost:5000/getAllList')
                .then(function (response) {
                    return response.json();
                }).then(function (response) {
                    getList(response);
                    console.log('GET response:' + text);
                });
        })
})
