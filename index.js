class List {
    constructor(name) {
        this.name = name;
        this.items = []
    }

    addItem(name, type) {
        this.items.push(new Item(name,type));
    }
}









class Item {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}

class ListService {
    static url =  'https://lit-crag-01942.herokuapp.com/lists'

    static getAllLists() {
        return $.get(this.url);
    }

    static getList(id) {
        return $.get(this.url + `/${id}`);
    }

    static createList(list){
        return $.post(this.url, list);
    }

    static updateList(list) {
        return $.ajax({
            url: this.url + `/${list._id}`,
            dataType: 'json',
            data: JSON.stringify(list),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteList(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });

    }
}

class DOMManager {
    static houses;

    static getAllLists() {
        ListService.getAllLists().then(lists => this.render(lists));
    }

static createList(name) {
    ListService.createList(new List(name))
        .then(() => {
            return ListService.getAllLists();
        })
            .then((lists) => this.render(lists));
}


static deleteList(id) {
        ListService.deleteList(id)
            .then(() => {
                return ListService.getAllLists();
            })
            .then((lists) => this.render(lists));
        }


static addItem(id) {
    for (let list of this.lists) {
        if(list._id == id) {
            list.item.push(new Item($(`#${list._id}-item-name`).val(), $(`#${list._id}-item-type`).val()))
            ListService.updateList(list) 
                .then(() => {
                    return ListService.getAllLists();
                })
                .then((lists) => this.render(lists));
            
        }
    }
}

static deleteItem(listID, itemID) {
    for (let list of this.lists) {
        if(list._id == listID) {
            for( let item of list.items) {
                if(item._id == itemID){
                    list.items.splice(list.items.indexOr(room), 1);
                    ListService.updateList(list)
                    .then(() => {
                        return ListService.getAllLists();
                    })
                    .then((lists) => this.render(lists))
                }
            }
        }
    }
}


    static render(lists) {
        this.lists = lists;
        $('#app').empty();
        for (let list of lists) {
            $('#app').prepend(
                `<div id="${list._id}" class="card">
                <div class="card-header">
                <h2>${list.name}</h2>
                <button class="btn btn-danger" onclick="DOMManager.deleteList('${list._id}')">Delete</button>
                </div>
                <div class="card-body">
                <div class="card">
                <div class="row">
                <div class="col-sm">
                    <input type="text" id="${list._id}-item-type" class="form-control" placeholder="Item Type">
                </div>
                <div class="col-sm"
                    <input type="text" id="${list._id}-item-name" class="form-control" placeholder="Item Name">
                    </div>
                </div>
                </div>
                <button id="${list._id}-new-type" onclick="DOMManager.addItem('${list._id}')" class=btn btn-primary form-control">Add</button>
                </div>
                </div>
                </div><br>
                `
            );
            for (let item of list.items) {
                $(`#${list._id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${item._id}"><strong>Name: </strong> ${item.name}</span>
                    <span id="type-${item._id}"><strong>type: </strong> ${item.type}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteItem('${list._id}', '${item._id}')"Delete Item</button>`
                );
            }
        }
    }
}


$('#create-new-list').click(() => {
    DOMManager.createList($('#new-app-name').val());
    $('#new-app-name').val(' ');
});

DOMManager.getAllLists();