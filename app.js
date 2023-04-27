const url = 'https://644a810e79279846dcea8de2.mockapi.io/products';

const form = document.querySelector('#formEdit');
let customName,customDescription,idToEdit;
const listContainer = document.querySelector('#listContainer');

const getData = () => {
    listContainer.innerHTML = '';
    $.get(url,(data,status) => {
        data.forEach(prod => {
            let div = document.createElement('div');
            div.innerHTML = (`
            <h5>${prod.name}</h5>
            <p>${prod.description}</p>
            <button id="btnEdit-${prod.id}" data-id="${prod.id}">Editar</button>
            <button id="btnDelete-${prod.id}" data-id="${prod.id}">Eliminar</button>
            `)
            listContainer.append(div);
            let btnEditSelected = document.getElementById(`btnEdit-${prod.id}`);
            btnEditSelected.addEventListener('click',(e) => {
                customName = document.querySelector('#customName');
                customName.value = prod.name;
                customDescription = document.querySelector('#customDescription');
                customDescription.value = prod.description;
                idToEdit = prod.id;
            })
            let btnDeleteSelected = document.getElementById(`btnDelete-${prod.id}`);
            btnDeleteSelected.addEventListener('click',(e) => {
                idToEdit = e.target.dataset.id;
                $.ajax({
                    type: 'DELETE',
                    url: url + `/${idToEdit}`,
                    contentType: 'application/json',
                    success: () => {
                        getData()
                    }
                })
            })
        });
    })
}
getData()

form.addEventListener('submit',(e) => {
    const isEdit = document.querySelector('#edit').checked;
    const isCreate = document.querySelector('#create').checked;
    customName = document.querySelector('#customName').value;
    customDescription = document.querySelector('#customDescription').value;
    if (customName === "" || customDescription === "") {
        e.preventDefault();
        alert('Complete todos los campos')
    } else {
        if (isEdit || isCreate) {
            e.preventDefault();
            let customData = {
                name: customName,
                description: customDescription
            }
            if (idToEdit && isEdit) {
                $.ajax({
                    type: 'PUT',
                    url: url + `/${idToEdit}`,
                    data: JSON.stringify(customData),
                    contentType: 'application/json',
                    success: () => {
                        getData()
                    }
                })
            } else if (isEdit) {
                alert('Seleccione un prod   ')
            }
            isCreate && (
                $.post(url,customData,(data,status) => {
                    getData()
                })
            );
        } else {
            e.preventDefault();
            alert('Selecciona si quieres editar o crear un producto')
        }
    }
})
