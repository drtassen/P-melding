const MAKS_PLASSER = 20;
const ADMIN_PASSORD = "Hub123";
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz7VAb0JAIfahNMU2UGZu3klcQMoJDGr2s1-oksBdFSFHCNwKdton6sXUuNi9A-9oFu/exec";

let deltakere = [];
let erAdmin = false;

// ====================== HENT & SEND ======================
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
    console.log("Sender til server:", data);   // Debug

    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });

    const text = await res.text();           // Les rå svar først
    console.log("Rått svar fra server:", text);

    const result = JSON.parse(text);
    console.log("Parsed resultat:", result);

    return result;

  } catch (e) {
    console.error("FEIL ved sending:", e);
    alert("Teknisk feil: " + e.message);
    return { success: false };
  }
}

// ====================== OPPDATER LISTE ======================
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

    deltakere.forEach((person) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${person.navn}</strong><br>

            ${erAdmin ? `
                👨‍👩‍👦 ${person.forelderNavn}<br>
                ☎ ${person.forelderTelefon}<br>
                🩺 ${person.bat || 'Ingen info'}<br>
            ` : ''}

            <small>${person.tid}</small><br>

            <button class="slettEgen" onclick="slettMin('${person.kode || ''}')">
                Slett min påmelding
            </button>

            ${erAdmin ? `
                <div class="slett" onclick="slett(${person.row})">
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

// ====================== SLETT ======================
async function slett(row){
    if(confirm("Slette denne påmeldingen?")){
        const result = await sendTilServer({ action: "delete", row: row });
        if(result.success){
            hentDeltakere();
        } else {
            alert("Kunne ikke slette");
        }
    }
}

async function slettMin(kode){
    const person = deltakere.find(p => p.kode === kode);
    if(!person){
        alert("Fant ikke påmeldingen");
        return;
    }
    if(confirm("Vil du slette din påmelding?")){
        const result = await sendTilServer({ action: "delete", row: person.row });
        if(result.success){
            hentDeltakere();
        } else {
            alert("Kunne ikke slette");
        }
    }
}
// ====================== ADMIN ======================
async function tomListe(){
    if(confirm("Slette HELE listen?")){
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
// ====================== START ======================
hentDeltakere();


// ====================== QUIZ (uendret) ======================
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