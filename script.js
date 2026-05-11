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



// ==================== SNAKE GAME ====================

const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");

let snake = [{x:150,y:150}];
let food = {x:60,y:60};
let dx = 10;
let dy = 0;

document.addEventListener("keydown",e=>{

    if(e.key==="ArrowUp"){dx=0;dy=-10;}
    if(e.key==="ArrowDown"){dx=0;dy=10;}
    if(e.key==="ArrowLeft"){dx=-10;dy=0;}
    if(e.key==="ArrowRight"){dx=10;dy=0;}

});

function draw(){

    ctx.clearRect(0,0,300,300);

    ctx.fillStyle="lime";

    snake.forEach(part=>{
        ctx.fillRect(part.x,part.y,10,10);
    });

    ctx.fillStyle="red";
    ctx.fillRect(food.x,food.y,10,10);

    const head = {
        x:snake[0].x + dx,
        y:snake[0].y + dy
    };

    snake.unshift(head);

    if(head.x === food.x && head.y === food.y){

        food = {
            x:Math.floor(Math.random()*30)*10,
            y:Math.floor(Math.random()*30)*10
        };

    }else{
        snake.pop();
    }

    if(
        head.x < 0 ||
        head.y < 0 ||
        head.x >= 300 ||
        head.y >= 300
    ){

        snake = [{x:150,y:150}];

    }

}

setInterval(draw,100);