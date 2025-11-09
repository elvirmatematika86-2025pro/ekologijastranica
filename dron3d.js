<script>
// =============== 3D DRON SCENA (THREE.JS) ==================
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1.8, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(450, 320);
document.getElementById("dron3d").appendChild(renderer.domElement);

// --- Zemlja / trava ---
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(6, 6),
  new THREE.MeshStandardMaterial({ color: 0x285428 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// --- Dron tijelo ---
const dron = new THREE.Group();
const telo = new THREE.Mesh(
  new THREE.BoxGeometry(0.6, 0.2, 0.6),
  new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.3, roughness: 0.4 })
);
dron.add(telo);

// --- Elisi (4 komada) ---
const elisaGeo = new THREE.BoxGeometry(0.25, 0.02, 0.05);
const elisaMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
const pozicije = [
  [0.3, 0.12, 0.3],
  [-0.3, 0.12, 0.3],
  [0.3, 0.12, -0.3],
  [-0.3, 0.12, -0.3],
];
let elise = [];
pozicije.forEach(pos => {
  const e = new THREE.Mesh(elisaGeo, elisaMat);
  e.position.set(...pos);
  dron.add(e);
  elise.push(e);
});
scene.add(dron);

// --- Svjetlo ---
const ambLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(3, 4, 2);
scene.add(pointLight);

// --- Kamera ---
camera.position.set(2, 2, 3);
camera.lookAt(0, 0, 0);

// --- Nebo (svjetlosni efekat) ---
const skyGeo = new THREE.SphereGeometry(50, 32, 32);
const skyMat = new THREE.MeshBasicMaterial({
  color: 0x0c1e10,
  side: THREE.BackSide,
});
const sky = new THREE.Mesh(skyGeo, skyMat);
scene.add(sky);

// --- Let animacija ---
let t = 0;
function anim() {
  requestAnimationFrame(anim);
  dron.position.y = Math.sin(t) * 0.3 + 1;
  dron.rotation.y += 0.01;
  elise.forEach((e, i) => (e.rotation.y += (i % 2 ? 0.4 : -0.4)));
  t += 0.05;
  renderer.render(scene, camera);
}
anim();

// ================= AI GLAS + SENSOR SISTEM =================

// Kreiraj indikator stabilnosti (krug u uglu)
const indikator = document.createElement("div");
indikator.style.cssText = `
position: fixed; right: 25px; bottom: 25px;
width: 80px; height: 80px; border-radius: 50%;
background: radial-gradient(circle, #0f0 0%, #060 80%);
box-shadow: 0 0 25px #0f0;
transition: all 1s ease; z-index:999;
`;
document.body.appendChild(indikator);

function promijeniStatus(boja, tekst) {
  indikator.style.background = `radial-gradient(circle, ${boja} 0%, #000 90%)`;
  indikator.style.boxShadow = `0 0 30px ${boja}`;
  govoriAI(tekst);
}

// Simulacija stabilnosti svake 10 sekundi
setInterval(() => {
  const temp = (18 + Math.random() * 10).toFixed(1);
  const vlaga = (40 + Math.random() * 40).toFixed(1);
  const co2 = (380 + Math.random() * 80).toFixed(0);
  const o2 = (19 + Math.random() * 3).toFixed(1);
  const bakterije = ["Normalna", "Aktivna", "Visoka", "Kritična"];
  const bact = bakterije[Math.floor(Math.random() * bakterije.length)];

  // Logički sistem praćenja
  if (co2 > 440 || vlaga < 45 || bact === "Kritična") {
    promijeniStatus("#ff0000", "⚠️ Upozorenje: sistem nije stabilan! Potrebna intervencija u sektoru C2.");
  } else if (bact === "Visoka") {
    promijeniStatus("#ffff00", "🟡 Upozorenje: visoka bakterijska aktivnost u tlu.");
  } else {
    promijeniStatus("#00ff00", "✅ Sistem stabilan, sve vrijednosti u granicama normale.");
  }

}, 10000);

// --- Glasovna funkcija (AI glas) ---
function govoriAI(tekst) {
  const glas = new SpeechSynthesisUtterance(tekst + " Potpisuje Elvir AI, digitalni agronom.");
  glas.lang = "bs-BA";
  glas.pitch = 0.95;
  glas.rate = 0.94;
  glas.volume = 1;
  speechSynthesis.speak(glas);
}
</script>
