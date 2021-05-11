let employeeDOM = document.querySelector("#customerDatas");
let employeeTbHeading=document.querySelector("#tableHeading");
let langSelect=document.querySelector(".custom-select");
let btnRegister=document.querySelector("#Register")
let userName=document.querySelector("#username")
let nameSurname=document.querySelector("#NameSurname")
let mail=document.querySelector("#Mail");
let password=document.querySelector("#password");
let checkUsername=document.querySelector("#checkusername");
let checkpassword=document.querySelector("#checkpassword");
let loginBTN=document.querySelector("#loginBTN");
let mainSection=document.querySelector("#MainSection");
let BtnLogout=document.querySelector("#LogOut")
//getting Employee
class Employee {

  async getEmployee() {
    try {
      let result = await fetch("https://randomuser.me/api/");
      let data = await result.json();
  
      return data;
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


//Display Employee

class UI {
  static displayEmployee(employees) {
   
    let result = "";
    employees.forEach((employeeItem) => {

 
     result += `  <tr>
     
      <td>${employeeItem.name.title}.${employeeItem.name.first} ${employeeItem.name.last} </td>
       <td style="width:10%" >
			      <img src="${employeeItem.picture.large}" style="height:auto" class="w-100 img-fluid img-thumbnail" alt="" image">
	    </td>
      <td>
      ${employeeItem.email}
      </td>
      <td>
      ${employeeItem.cell}
      </td>
      <td>
      ${employeeItem.location.country}- ${employeeItem.location.city}:${employeeItem.location.street.number}..${employeeItem.location.street.name}
      </td>
      <td>
      ${employeeItem.gender}
      </td>
      <td>
      ${employeeItem.login.username}
      </td>
      <td>
      ${employeeItem.login.password}
      </td>
      <td>
      ${employeeItem.registered.date}
      </td>
    </tr>`;
    });

    employeeDOM.innerHTML = result;
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
      <th scope="col">${lang.email}</th>
      <th scope="col">${lang.cell}</th>
      <th scope="col">${lang.location}</th>
      <th scope="col">${lang.gender}</th>
      <th scope="col">${lang.username}</th>
      <th scope="col">${lang.password}</th>
      <th scope="col">${lang.registereddate}</th>
      <th></th>
    </tr>    
      `;
     employeeTbHeading.innerHTML=langresult;
     document.querySelector("#welcome").innerHTML=lang.welcome;
  }

}
//Storage

class Storages{

  static saveSessionEmployees(employess)
  {
    sessionStorage.setItem("employees",JSON.stringify(employess))
  }
  static getSessionEmployees()
  {
    return JSON.parse(sessionStorage.getItem("employees"));
  }
  static saveLocalLang(langs)
  {
    localStorage.setItem("langs",JSON.stringify(langs))
  }
  static getLocalLang()
  {
    return JSON.parse(localStorage.getItem("langs"));
  }
  static setSessionUser(username,password,nameSurname,mail)
  {
    let users={
      "username":username,
      "nameSurname":nameSurname,
      "mail":mail,
      "password":password
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
  
  const ui = new UI();
  const employee = new Employee();
  const langs=new Langs();

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


 
 


  employee.getEmployee().then((data) => {
    Storages.saveSessionEmployees(data.results);
    UI.displayEmployee(Storages.getSessionEmployees())
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
    if(username.value!="" && password.value!="" && nameSurname.value!=""){
    Storages.setSessionUser(username.value,password.value,nameSurname.value,mail.value)

    document.querySelector("#register").setAttribute("style","display:none")
    document.querySelector("#login").setAttribute("style","display:block")
    }
    else {
      alert("Tam doldur")
    }
    
  })
  loginBTN.addEventListener("click",(e)=>{
    e.preventDefault();
    let userInfo=Storages.getSessionUser();
    if(userInfo.username==checkUsername.value && userInfo.password==checkpassword.value )
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
  document.querySelector("#showPassword").addEventListener("click",()=>{
    if(password.type=="password" ||  checkpassword.type=="password")
    {
      checkpassword.type="text"
      password.type="text";
      document.querySelector("#showPassword").style.color="blue"
    }
    else
    {
      password.type="password";
      checkpassword.type="password";
      document.querySelector("#showPassword").style.color="black"
    }

  });

document.querySelector("#logregister").addEventListener("click",()=>{
  var currentUser=Storages.getSessionUser();
  userName.value=currentUser.username;
  password.value=currentUser.password;
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
        
    }
    
  })


 
});

