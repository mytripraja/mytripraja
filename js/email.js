/* =========================================================
   EMAIL COMPONENT
   Sends the form to php/save_email.php without leaving page.
   ========================================================= */
const notifyForm = document.getElementById("notifyForm");
const notifyButton = document.getElementById("notifyButton");
const formMessage = document.getElementById("formMessage");

notifyForm.addEventListener("submit",async(event)=>{
  event.preventDefault();

  notifyButton.disabled=true;
  notifyButton.textContent="SAVING...";
  formMessage.textContent="";
  formMessage.className="form-message";

  try{
    const response = await fetch(notifyForm.action,{
      method:"POST",
      body:new FormData(notifyForm),
      headers:{Accept:"application/json"}
    });

    const data = await response.json();

    if(!response.ok || !data.success){
      throw new Error(data.message || "Unable to save your email.");
    }

    formMessage.textContent=data.message;
    formMessage.className="form-message ok";
    notifyForm.reset();

  }catch(error){
    formMessage.textContent=error.message;
    formMessage.className="form-message err";

  }finally{
    notifyButton.disabled=false;
    notifyButton.textContent="NOTIFY ME";
  }
});
