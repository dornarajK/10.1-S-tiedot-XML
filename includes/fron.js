async function sendData() {
  const formData = new URLSearchParams();
  const formArvosanat = document.querySelector("#kurssiarvosanat").value;
  formData.append("kurssiarvosanat", formArvosanat)

  try {
    const response = await fetch("http://localhost:3000/saa", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if(data.viesti === "ok"){
      document.getElementById("kurssiarvosanat").value="";
    
    }else{
      throw new err("virhe lisästtäessä saa") 
    }
  } catch (err) {
    console.log(err)
  }
}

async function search() {
  const formData = new URLSearchParams();
  const formKurssi = document.querySelector("#kurssi").value;
  const formOpiskelija = document.querySelector("#opiskelija").value;
  formData.append("kurssi", formKurssi);
  formData.append("opiskelija", formOpiskelija);

  try {
    const response = await fetch("http://localhost:3000/saa", {
      method: "POST",
      body: formData,
    });
    
    const data=await response.json();

    if(data.length===0){
      console.log('virhe')

    }else{
      const arvosana = data.map(item => `<p>${item.opiskelija}-${item.kurssi}: ${item.arvosana}</p>`).join('');
      document.getElementById("hakutulos").innerHTML = arvosana

    }
  } catch (err) {

    console.error(err);

  }
}
