let inputName = document.getElementById("inputName");
let inputPrice = document.getElementById("inputPrice");
let inputCategory = document.getElementById("inputCategory");
let inputId = document.getElementById("inputId");
let inputSearch = document.getElementById("inputSearch");
let alertName = document.getElementById("alertName");
let alertPrice = document.getElementById("alertPrice");

let alertCondition = document.getElementById("alertCondition");
let btnAdd = document.getElementById("btnAdd");
let btnClear = document.getElementById("btnClear");
let tableBody = document.getElementById("tableBody");
let currentIndex = 0;
let layanans = [];
document.addEventListener('DOMContentLoaded', getData);

    btnAdd.addEventListener("click", async _ => {
        if (validName() && validPrice()) {
            let layanan = {
                namaLayanan: inputName.value,
                deskripsiLayanan: inputDescription.value,
                hargaLayanan: parseInt(inputPrice.value, 10),
                statusLayanan: 1
            };

            if (btnAdd.innerHTML === "Add Product") {
                try {
                    console.log(layanan)
                    let response = await fetch('http://localhost:8080/layanans/saveLayanan', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(layanan)
                    });

                    if (response.ok) {
                        alert('Layanan added successfully!');
                        layanans.push(layanan);
                        localStorage.setItem("Products", JSON.stringify(layanans));
                        displayProduct();
                        clearForm();
                        inputName.classList.remove("is-valid");
                        inputPrice.classList.remove("is-valid");
                        inputDescription.classList.remove("is-valid");
                        
                        
                    } else {
                        console.error('Failed to add product', response.statusText);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            } else if (btnAdd.innerHTML === "Update Product") {
                updateProduct();
                clearForm();
                inputName.classList.remove("is-valid");
                inputPrice.classList.remove("is-valid");
                inputDescription.classList.remove("is-valid");
                inputCondition.classList.remove("is-valid");
            }
        }
    });
    function showNotification(message) {
        const notification = document.getElementById("notification");
        notification.innerHTML = message;
        notification.style.display = "block";
    
        setTimeout(() => {
            notification.style.display = "none";
        }, 3000); // Hide after 3 seconds
    }
async function getData() {
    try {
        const response = await fetch('http://localhost:8080/layanans/getLayanans'); // Replace with your API endpoint
        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }
        const layananss = await response.json();
        layanans = layananss.data;
        console.log(layanans)
        displayProduct(layanans);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function displayProduct(layanans) {
    let temp = "";
    for(let i = 0; i < layanans.length; i++){
        temp += `
        <p id="inputId" style="display : none;">${layanans[i].idLayanan}</p>
        <tr>
            <td>${i + 1}</td>
            <td>${layanans[i].namaLayanan}</td>
            <td>${layanans[i].deskripsiLayanan}</td>
            <td>${layanans[i].hargaLayanan}</td>
            <td>
                <i onclick="getProductInformation(${i})" title="Update" class="fa-solid me-2 text-warning fa-pen"></i>
                <i onclick="deleteProduct(${i})" title="Delete" class="fa-solid text-danger fa-trash"></i>
            </td>
        </tr>`;
    }
    tableBody.innerHTML = temp
}
btnClear.addEventListener("click",clearForm)
function clearForm(){
    inputName.value = ""
    inputPrice.value = ""
    inputDescription.value = ""
    inputName.classList.remove("is-valid")
    inputName.classList.remove("is-invalid")
    alertName.classList.replace("d-block","d-none")
    inputPrice.classList.remove("is-valid")
    inputPrice.classList.remove("is-invalid")
    alertPrice.classList.replace("d-block","d-none")
    inputDescription.classList.remove("is-valid")
    inputDescription.classList.remove("is-invalid")
    alertCategory.classList.replace("d-block","d-none")    
    inputCondition.classList.remove("is-valid")
    inputCondition.classList.remove("is-invalid")
    alertCondition.classList.replace("d-block","d-none")
}
function getProductInformation(index){
    currentIndex = index
    inputName.value = layanans[currentIndex].namaLayanan
    inputPrice.value = layanans[currentIndex].hargaLayanan
    inputDescription.value = layanans[currentIndex].deskripsiLayanan
inputId.value = layanans[currentIndex].idLayanan
    btnAdd.classList.replace("btn-success","btn-warning")
    btnAdd.innerHTML = "Update Product"
    inputName.classList.remove("is-invalid")
    alertName.classList.replace("d-block","d-none")
    inputPrice.classList.remove("is-invalid")
    alertPrice.classList.replace("d-block","d-none")
    
    
    
    document.getElementById('formContent').style.display = 'block';
            document.getElementById('tableContent').style.display = 'none';

}
async function updateProduct() {
    if (validName() && validPrice()) {
        let layanan = {
            idLayanan: parseInt(inputId.value,10),
            namaLayanan: inputName.value,
            deskripsiLayanan: inputDescription.value,
            hargaLayanan: parseInt(inputPrice.value, 10),
            statusLayanan: 1
        };

        try {
            // PUT request to update product
            let response = await fetch(`http://localhost:8080/layanans/updateLayanan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(layanan)
            });

            if (response.ok) {
                alert('Layanan updated successfully!');
                layanans.push(layanan);
                localStorage.setItem("Products", JSON.stringify(layanans));
                displayProduct();
                clearForm();
                inputName.classList.remove("is-valid");
                inputPrice.classList.remove("is-valid");
                inputDescription.classList.remove("is-valid");
                
                alert('Layanan updated successfully!');

                // Reset button and form display
                btnAdd.classList.replace("btn-warning", "btn-success");
                btnAdd.innerHTML = "Add Product";
                document.getElementById('formContent').style.display = 'none';
                document.getElementById('tableContent').style.display = 'block';
            } else {
                console.error('Failed to update product', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

async function deleteProduct(index) {
    try {
        let response = await fetch(`http://localhost:8080/layanans/deleteLayanan/${layanans[index].idLayanan}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Layanan deleted successfully!');
            layanans.splice(index, 1);
            localStorage.setItem("Products", JSON.stringify(layanans));
            displayProduct();
            console.log('Layanan deleted successfully');
        } else {
            console.error('Failed to delete product', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
inputSearch.addEventListener("keyup",_=>{
    let temp = "";
    let conditionRow = "";
    for(let i=0;i<layanans.length;i++){
        if(layanans[i].name.toLowerCase().includes(inputSearch.value.toLowerCase())){
            
            temp += `
            <tr>
                <td>${i + 1}</td>
                <td>${layanans[i].name}</td>
                <td>${layanans[i].price}</td>
                <td>${layanans[i].description}</td>
                ${conditionRow}
                <td>
                    <i onclick="getProductInformation(${i})" title="Update" class="fa-solid me-2 text-warning fa-pen"></i>
                    <i onclick="deleteProduct(${i})" title="Delete" class="fa-solid text-danger fa-trash"></i>
                </td>
            </tr>`
        }
    }
    tableBody.innerHTML = temp
})
inputName.addEventListener("keyup",validName)
inputPrice.addEventListener("keyup",validPrice)
function validName(){
    let regex = /^[A-Z][a-zA-Z0-9 ]+$/
    if(regex.test(inputName.value)){
        inputName.classList.add("is-valid")
        inputName.classList.remove("is-invalid")
        alertName.classList.replace("d-block","d-none")
        return true
    } else{
        inputName.classList.add("is-invalid")
        inputName.classList.remove("is-valid")
        alertName.classList.replace("d-none","d-block")
        return false
    }
}
function validPrice(){
    let regex = /^[1-9][0-9]{2,}$/
    if(regex.test(inputPrice.value)){
        inputPrice.classList.add("is-valid")
        inputPrice.classList.remove("is-invalid")
        alertPrice.classList.replace("d-block","d-none")
        return true
    } else{
        inputPrice.classList.add("is-invalid")
        inputPrice.classList.remove("is-valid")
        alertPrice.classList.replace("d-none","d-block")
        return false
    }
}
function validDescription(){
    if(inputDescription.value === ""){
        inputDescription.classList.add("is-invalid")
        inputDescription.classList.remove("is-valid")
        alertCategory.classList.replace("d-none","d-block")
        return false
    } else{
        inputDescription.classList.add("is-valid")
        inputDescription.classList.remove("is-invalid")
        alertCategory.classList.replace("d-block","d-none")
        return true
    }
}
function validCondition(){
    if(inputCondition.value === ""){
        inputCondition.classList.add("is-invalid")
        inputCondition.classList.remove("is-valid")
        alertCondition.classList.replace("d-none","d-block")
        return false
    } else{
        inputCondition.classList.add("is-valid")
        inputCondition.classList.remove("is-invalid")
        alertCondition.classList.replace("d-block","d-none")
        return true
    }
}
