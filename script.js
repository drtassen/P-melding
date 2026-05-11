const MAKS_PLASSER = 20;
const ADMIN_PASSORD = "Hub123";

let deltakere = [];
let erAdmin = false;

function lagre(){
    localStorage.setItem("retrohub", JSON.stringify(deltakere));
}

function last(){
    const data = localStorage.getItem("retrohub");
    deltakere = data ? JSON.parse(data) : [];
    oppdater();
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

document.getElementById("pameldingForm").addEventListener("submit",function(e){

    e.preventDefault();

    if(deltakere.length >= MAKS_PLASSER){
        alert("Det er fullt!");
        return;
    }

    const navn = document.getElementById("navn").value.trim();
    const forelderNavn = document.getElementById("forelderNavn").value.trim();
    const forelderTelefon = document.getElementById("forelderTelefon").value.trim();
    const bat = document.getElementById("bat").value.trim();

    const kode = Math.random().toString(36).substring(2,8);

    deltakere.push({
        navn,
        forelderNavn,
        forelderTelefon,
        bat,
        kode,
        tid:new Date().toLocaleString("no-NO")
    });

    lagre();

    alert(`✅ Påmeldt!\n\nDin slettekode:\n${kode}`);

    this.reset();

    oppdater();

});

function slett(index){

    if(confirm("Slette påmeldingen?")){

        deltakere.splice(index,1);

        lagre();

        oppdater();

    }

}

function slettMin(kode){

    const index = deltakere.findIndex(p => p.kode === kode);

    if(index === -1){
        alert("Fant ikke påmeldingen");
        return;
    }

    if(confirm("Vil du slette din påmelding?")){

        deltakere.splice(index,1);

        lagre();

        oppdater();

    }

}

function tomListe(){

    if(confirm("Slette hele listen?")){

        deltakere = [];

        lagre();

        oppdater();

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

last();



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