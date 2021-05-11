let customerDOM = document.querySelector("#customerDatas");
let modalTitle=document.querySelector('.modal-title');
let loanersDOM=document.querySelector('#loanersDOM');
let customersTbHeading=document.querySelector("#tableHeading");
let langSelect=document.querySelector(".custom-select");
let btnLoanHistory=document.querySelector('.btnLoanHistory');
let filterActiveLoan=document.querySelectorAll(".filterActiveLoan");
let filterName=document.querySelector("#filterName");
let minValue=document.querySelector("#minValue");
let maxValue=document.querySelector("#maxValue");
let btnRegister=document.querySelector("#Register")
let userName=document.querySelector("#username")
let nameSurname=document.querySelector("#NameSurname")
let mail=document.querySelector("#Mail");
let checkUsername=document.querySelector("#checkusername");
let loginBTN=document.querySelector("#loginBTN");
let mainSection=document.querySelector("#MainSection");
let BtnLogout=document.querySelector("#LogOut")
//getting Customers
class Customer {

  async getCustomers() {
    try {
      let result = await fetch("assets/js/db.json");
      let data = await result.json();
      let customers = data.map((item) => {
        const { id, name, surname, img, salary, loans,hasLoanHistory } = item;
        return { id, name, surname, img, salary, loans,hasLoanHistory };
      });
      return customers;
    } catch (error) {
     
    }
  }
  async getCustomerById(id)
  {
    try {
        let customItem = await fetch("assets/js/db.json");
        let customData = await customItem.json();
        
        return customData[id-1];
      } catch (error) {
       
      }

  }
}
class Langs{

  async getLangs()
  {
    try{
      let langs=await fetch("assets/js/tableHeading.json");
      let langsData=langs.json();
      return langsData;
    }catch(error)
    {
    
    }

  }

}

class FilterDatas
{
    filterActiveLoan(customers,filterText)
    {
      
  
      
                switch(filterText)
                {
                    case "All":
                      UI.displayCustomers(customers);
                      if(filterName.value!="")
                      this.filterCustomerName(customers,filterName.value)
                        
                    break;
                    case "Active":
                         let aktive=customers.filter(x=>x.loans.filter(x=>x.closed!=true).length>1)
                         UI.displayCustomers(aktive);
                         if(filterName.value!="")
                         this.filterCustomerName(aktive,filterName.value)
                    break;
                    case "Deactive":
                    let deaktive=customers.filter(x=>x.loans.filter(x=>x.closed!=false).length>1)
                        UI.displayCustomers(deaktive);
                        if(filterName.value!="")
                        this.filterCustomerName(deaktive,filterName.value)
                    break;
                }
         
    }
    filterCustomerName(customers,filterNameparam)
    {
      
  console.log(filterNameparam)
      if(filterNameparam!=null)
        customers=customers.filter(x=>x.name.toLowerCase().includes(filterNameparam.toLowerCase()) || x.surname.toLowerCase().includes(filterNameparam.toLowerCase() )); 
         
      this.filterActiveLoan(customers,filterActiveLoan);
      UI.displayCustomers(customers);
     
 
    }

    filterMinMaxValue(customers,minValue=0,maxValue=100000000)
    {
      
      if(maxValue==0)
      {
        maxValue=100000;
      }
      minValue=Number(minValue);
      maxValue=Number(maxValue)
      
        customers=customers.filter(x=>x.salary.value>=Number(minValue) && x.salary.value<=Number(maxValue)); 
         UI.displayCustomers(customers);
    }
}
//Display Customers

class UI {
  static displayCustomers(customers) {
    let result = "";
    customers.forEach((customer) => {
      let activeLoans = false;
      let loans = customer.loans;
      let loansLength = Object.keys(loans).length;
      let totalPayment = 0;
      let isApply = true;
      let hasLoanHistory=true;

      //ActiveLoansStatus
      for (let i = 0; i < loansLength; i++) {
        if (loans[i].closed != true) {
          activeLoans = true;
          break;
        } else {
          activeLoans = false;
        }
      }
      //TotalPayment

      for (let i = 0; i < loansLength; i++) {
        if (loans[i].dueAmount.value != 0) {
          totalPayment += loans[i].perMonth.value;
        }
      }
      //ApplayLoan
      if (customer.salary.value * 0.45 > totalPayment) {
        isApply = true;
      } else {
        isApply = false;
      }
      //hasLoanHistory
 
      result += `  <tr>
     
      <td>${customer.name} ${customer.surname}</td>
       <td style="width:15%" >
			      <img src="${customer.img}" style="height:auto" class="w-100 img-fluid img-thumbnail" alt="${customer.name} image">
	    </td>
      <td>${customer.salary.value} ${customer.salary.currency}</td>
      <td>  <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        disabled
        ${activeLoans ? `checked` : ``}
        value="" 
        id="flexCheckDefault"
      />
    </div> 
      </td>
      <td>
       ${totalPayment.toFixed(2)} ${customer.loans[0].perMonth.currency}
      </td>
     
      <td>
      ${
        isApply
          ? `<button type="button" class="btn btn-success disabled">Uyğundur</button>`
          : ` <button type="button" class="btn btn-danger disabled">Uyğun deyil</button>`
      }
      </td>
      <td>
      ${(customer.hasLoanHistory?` <button data-id=${customer.id} type="button" data-toggle="modal" data-target="#exampleModal" class="btn btn-primary btnLoanHistory">Kredit Tarixçəsi</button>` : ` <button type="button" data-id=${customer.id} class="btn btn-warning " disabled>Kredit Tarixçəsi Yoxdur</button> ` )}
  
      </td>
    </tr>`;
    });
    customerDOM.innerHTML = result;
  }
  displayLoanTable(loaners){
    console.log(loaners)
    let loanersResult="";
    loaners.forEach(loan=>{
        loanersResult+=`
        <tr>
        <td >${loan.loaner}</td>
        <td >${loan.amount.value} ${loan.amount.currency}</td>
        <td>  <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          disabled
          ${!loan.closed ? `checked` : ``}
          value="" 
          id="flexCheckDefault"
        />
      </div> 
        </td>
     <td >${loan.dueAmount.value!=0 ? loan.perMonth.value +` ` +  loan.perMonth.currency:`<span class="text-success font-weight-bold">Ödənilib</span>`}</td>
        <td >${loan.dueAmount.value} ${loan.dueAmount.currency}</td>
        <td >${loan.loanPeriod.start} - ${loan.loanPeriod.end}</td>
      </tr>

        `
    })
    loanersDOM.innerHTML=loanersResult;
  }
  static displayLangs(langs){
   
    let langRes=""
    langs.forEach(lang => {
      lang.selected? langRes+= `
      <option selected>${lang.lang.toUpperCase()}</option>
      `:
       langRes+= `
       <option >${lang.lang.toUpperCase()}</option>
       `
      });
      langSelect.innerHTML=langRes;
  }
  static changeTableHeading(lang)
  {
    let langresult=`
      <tr>
      <th scope="col">${lang.nameSurname}</th>
      <th scope="col">${lang.image}</th>
      <th scope="col">${lang.activeLoan}</th>
      <th scope="col">${lang.wage}</th>
      <th scope="col">${lang.totalPayment}</th>
      <th scope="col">${lang.applyStatus}</th>
      <th></th>
    </tr>    
      `;
      customersTbHeading.innerHTML=langresult;
  }

}
//Storage

class Storages{

  static saveSessionCustomers(customers)
  {
    sessionStorage.setItem("customers",JSON.stringify(customers))
  }
  static getSessionCustomers()
  {
    return JSON.parse(sessionStorage.getItem("customers"));
  }
  static saveLocalLang(langs)
  {
    localStorage.setItem("langs",JSON.stringify(langs))
  }
  static getLocalLang()
  {
    return JSON.parse(localStorage.getItem("langs"));
  }
  static setSessionUser(username,nameSurname,mail)
  {
    let users={
      "username":username,
      "nameSurname":nameSurname,
      "mail":mail
    }
    sessionStorage.setItem("user",JSON.stringify(users))
  }
  static getSessionUser()
  {
   
  return JSON.parse(sessionStorage.getItem("user"))
  }
  static setCookieUser(cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = `user =  ${cvalue};${expires};path=/`;
  }
  static deleteCookieUser(cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() - (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = `user =  ${cvalue};${expires};path=/`;
  }
  static getCookieUser(cname)
  {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split('=');
      return ca[1];
  }
  static checkCookieUser() {
    var user=Storages.getCookieUser();
    var inputUser=checkUsername.value;
    if (user !="" && user=== inputUser ) {

      return true;
    } else {
    return false;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  
  
if(!Storages.getSessionUser())
{

}
 else if(Storages.getCookieUser()!==undefined)
  {
    ;
    document.querySelector("#register").setAttribute("style","display:none")
     mainSection.setAttribute("style","display:block")
  }
  else
  {
    document.querySelector("#register").setAttribute("style","display:none")
    document.querySelector("#login").setAttribute("style","display:block")
  }

  const ui = new UI();
  const customer = new Customer();
  const filteritems=new FilterDatas();
 
  const langs=new Langs();

  customer.getCustomers().then((data) => {
    Storages.saveSessionCustomers(data);
    UI.displayCustomers(Storages.getSessionCustomers());
    filterName.addEventListener("keyup",()=>{
      filteritems.filterCustomerName(data,filterName.value)
    })
    filterName.addEventListener("keydown",()=>{
      filteritems.filterCustomerName(data,filterName.value)
    })
    minValue.addEventListener("keyup",MaxMinValue)
    minValue.addEventListener("change",MaxMinValue)
    minValue.addEventListener("click",MaxMinValue)

    maxValue.addEventListener("keyup",MaxMinValue)
    maxValue.addEventListener("change",MaxMinValue)
    maxValue.addEventListener("click",MaxMinValue)
    for (let i = 0; i < Array.from(filterActiveLoan).length; i++) {
      filterActiveLoan=Array.from(filterActiveLoan);
      filterActiveLoan[i].addEventListener("change",function(e){
          let filterText=e.target.value;
          filteritems.filterActiveLoan(data,filterText);
      })
    }
    function MaxMinValue(){
      filteritems.filterMinMaxValue(data,minValue.value,maxValue.value);
    }
  });
 
  langs.getLangs().then(lang=>{
    Storages.saveLocalLang(lang);
    UI.displayLangs(Storages.getLocalLang());
    UI.changeTableHeading(lang[0])
    langSelect.addEventListener("change",(e)=>{
      let selectedLang=e.target.value;
      let langItem;
    lang.forEach(item=>{
      item.selected=false;
      if(item.lang==selectedLang.toLowerCase()){
         langItem=item;
        
         Array.from(e.target.children).forEach(child=>{
            child.removeAttribute("selected")
            if(child.value==selectedLang)
            {
              child.setAttribute("selected","")
            }
          
            item.selected=true;
         })
      
      }
    
    })
    localStorage.clear();
    Storages.saveLocalLang(lang);

    UI.displayLangs(Storages.getLocalLang());
      UI.changeTableHeading(langItem)
    })
  })

  btnRegister.addEventListener("click",(e)=>{
    e.preventDefault();
    if(username.value!="" && nameSurname.value!="" && mail.value!="" ){
    Storages.setSessionUser(username.value,nameSurname.value,mail.value)

    document.querySelector("#register").setAttribute("style","display:none")
    document.querySelector("#login").setAttribute("style","display:block")
    }
    else {
      alert("Tam doldur")
    }
    
  })
  loginBTN.addEventListener("click",(e)=>{
    e.preventDefault();
    
    if(Storages.getSessionUser().username==checkUsername.value)
    {
      Storages.setCookieUser(checkUsername.value,1)
      mainSection.setAttribute("style","display:block")
      document.querySelector("#login").setAttribute("style","display:none")
      document.querySelector("#userLoginName").innerHTML=Storages.getCookieUser();
    }
    else
    {
      alert("Bele username Yoxdur!")
    }

  })
  BtnLogout.addEventListener("click",(e)=>{
    window.location.reload();
    Storages.deleteCookieUser(Storages.getSessionUser().username,1);
  })
document.querySelector("#logregister").addEventListener("click",()=>{
  var currentUser=Storages.getSessionUser();
  userName.value=currentUser.username;
  nameSurname.value=currentUser.nameSurname;
  userName.value=currentUser.username;
  mail.value=currentUser.mail;
  document.querySelector("#register").setAttribute("style","display:block")
  document.querySelector("#login").setAttribute("style","display:none")
})
document.querySelector("#userLoginName").innerHTML=Storages.getCookieUser();
  window.addEventListener("click",function(e){
    
    if(e.target.tagName=="BUTTON")
    {
        let dataid=e.target.getAttribute('data-id');
        customer.getCustomerById(dataid).then(data=>{
            ui.displayLoanTable(data.loans)
        })
    }
    
  })

 
});

