const MAKS_PLASSER = 20;
const ADMIN_PASSORD = "Hub123";
const WEB_APP_URL = "https://script.google.com/u/0/home/projects/1pzXa1SSbHafqWtkWB8xHUEDMNRhVqX0GQ6TYYfm7kbYZI2lVVNcOPzOe/edit";

let deltakere = [];
let erAdmin = false;

// ====================== NYE FUNKSJONER ======================
async function hentDeltakere() {
  try {
    const res = await fetch(WEB_APP_URL);
    deltakere = await res.json();
    oppdater();
  } catch (e) {
    console.error("Kunne ikke hente data", e);
  }
}

async function sendTilServer(data) {
  try {
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });
    return await res.json();
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

function oppdater(){

    document.getElementById("antall").textContent = deltakere.length;

    const status = document.getElementById("status");

    if(deltakere.length < MAKS_PLASSER){
        status.textContent = `✅ ${MAKS_PLASSER - deltakere.length} plasser igjen`;
        status.className = "status ledig";
    }else{
        status.textContent = "❌ Fullt";
        status.className = "status full";
    }

    const liste = document.getElementById("liste");

    liste.innerHTML = "";

    deltakere.forEach((person,index)=>{

        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${person.navn}</strong><br>

            ${erAdmin ? `
                👨‍👩‍👦 ${person.forelderNavn}<br>
                ☎ ${person.forelderTelefon}<br>
                🩺 ${person.bat || 'Ingen info'}<br>
            ` : ''}

            <small>${person.tid}</small><br>

            <button class="slettEgen" onclick="slettMin('${person.kode}')">
                Slett min påmelding
            </button>

            ${erAdmin ? `
                <div class="slett" onclick="slett(${index})">
                    ❌ Slett
                </div>
            ` : ''}
        `;

        liste.appendChild(li);

    });

}

// ====================== PÅMELDING ======================
document.getElementById("pameldingForm").addEventListener("submit", async function(e){
    e.preventDefault();

    if(deltakere.length >= MAKS_PLASSER){
        alert("Det er fullt!");
        return;
    }

    const navn = document.getElementById("navn").value.trim();
    const forelderNavn = document.getElementById("forelderNavn").value.trim();
    const forelderTelefon = document.getElementById("forelderTelefon").value.trim();
    const bat = document.getElementById("bat").value.trim();

    if (!navn || !forelderNavn || !forelderTelefon) {
        alert("Fyll inn alle feltene");
        return;
    }

    const result = await sendTilServer({ navn, forelderNavn, forelderTelefon, bat });

    if (result.success) {
        alert(`✅ Påmeldt!\n\n${navn} er nå registrert.`);
        this.reset();
        hentDeltakere();
    } else {
        alert("Noe gikk galt ved påmelding");
    }
});

async function slett(index){
    if(confirm("Slette påmeldingen?")){
        await sendTilServer({ action: "delete", row: deltakere[index].row });
        hentDeltakere();
    }
}

async function slettMin(kode){
    const person = deltakere.find(p => p.kode === kode);
    if(!person){
        alert("Fant ikke påmeldingen");
        return;
    }
    if(confirm("Vil du slette din påmelding?")){
        await sendTilServer({ action: "delete", row: person.row });
        hentDeltakere();
    }
}

async function tomListe(){
    if(confirm("Slette hele listen?")){
        await sendTilServer({ action: "clear" });
        hentDeltakere();
    }
}

document.getElementById("adminBtn").addEventListener("click",()=>{

    const passord = prompt("Admin-passord:");

    if(passord === ADMIN_PASSORD){

        erAdmin = true;

        document.getElementById("adminPanel").style.display = "block";

        oppdater();

        alert("✅ Admin aktivert");

    }else{

        alert("❌ Feil passord");

    }

});

hentDeltakere();



const quizData = [

{
    question:"Hvilket selskap lagde PlayStation?",
    answers:["Microsoft","Sony","Nintendo","Sega"],
    correct:1
},

{
    question:"Hva heter hovedpersonen i Zelda-serien?",
    answers:["Zelda","Mario","Link","Sonic"],
    correct:2
},

{
    question:"Hvilket spill har Creepers?",
    answers:["Minecraft","Fortnite","Roblox","GTA"],
    correct:0
},

{
    question:"Hva heter Nintendos maskot?",
    answers:["Luigi","Crash","Mario","Kirby"],
    correct:2
},

{
    question:"Hvilket spill er kjent for Victory Royale?",
    answers:["FIFA","Fortnite","Valorant","Rocket League"],
    correct:1
}

];

let currentQuestion = 0;
let score = 0;

function loadQuiz(){

    const q = quizData[currentQuestion];

    document.getElementById("sporsmal").textContent = q.question;

    const svarDiv = document.getElementById("svar");

    svarDiv.innerHTML = "";

    q.answers.forEach((answer,index)=>{

        const btn = document.createElement("button");

        btn.textContent = answer;

        btn.style.display = "block";
        btn.style.width = "100%";
        btn.style.margin = "10px 0";
        btn.style.background = "#00b894";
        btn.style.color = "white";

        btn.onclick = ()=>checkAnswer(index);

        svarDiv.appendChild(btn);

    });

}

function checkAnswer(index){

    const q = quizData[currentQuestion];

    if(index === q.correct){

        score++;

        alert("✅ Riktig!");

    }else{

        alert("❌ Feil!");

    }

    currentQuestion++;

    if(currentQuestion >= quizData.length){

        document.getElementById("quiz").innerHTML = `
            <h2>🎉 Quiz ferdig!</h2>
            <p>Du fikk ${score} av ${quizData.length} riktige!</p>
        `;

        return;

    }

    document.getElementById("score").textContent = `Score: ${score}`;

    loadQuiz();

}

loadQuiz();