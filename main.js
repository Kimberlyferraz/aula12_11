
// ===== SELECIONAR ELEMENTOS =====

const formulario = document.getElementById("formPage");
const mensagem = document.getElementById("msg");
const resultado = document.getElementById("resultado");

const nomePokemon = document.getElementById("nomePokemon");
const imgPokemon = document.getElementById("imgPoke");
const numeroPokemon = document.getElementById("numeroPokemon");

const tipos = document.getElementById("tipos");
const descricao = document.getElementById("descricao");

const altura = document.getElementById("altura");
const peso = document.getElementById("peso");
const basePokemon = document.getElementById("basePoke");

const habilidades = document.getElementById("habilidades");
const estatisticas = document.getElementById("estatisticas");
const golpes = document.getElementById("golpes");

const somPokemon = document.getElementById("somPokemon");
const botaoSom = document.getElementById("botaoSom");


// ===== TRADUZIR TIPOS =====

const nomesTipos = {
    normal: "Normal",
    fire: "Fogo",
    water: "Água",
    electric: "Elétrico",
    grass: "Grama",
    ice: "Gelo",
    fighting: "Lutador",
    poison: "Veneno",
    ground: "Terrestre",
    flying: "Voador",
    psychic: "Psíquico",
    bug: "Inseto",
    rock: "Pedra",
    ghost: "Fantasma",
    dragon: "Dragão",
    dark: "Sombrio",
    steel: "Aço",
    fairy: "Fada"
};


// ===== TRADUZIR ATRIBUTOS =====

const nomesStatus = {
    hp: "Vida (HP)",
    attack: "Ataque",
    defense: "Defesa",
    "special-attack": "Ataque especial",
    "special-defense": "Defesa especial",
    speed: "Velocidade"
};


// ===== LIMPAR RESULTADO =====

function limparResultado() {

    nomePokemon.textContent = "";
    numeroPokemon.textContent = "";
    imgPokemon.src = "";
    tipos.innerHTML = "";
    descricao.textContent = "";

    altura.textContent = "";
    peso.textContent = "";
    basePokemon.textContent = "";

    habilidades.innerHTML = "";
    estatisticas.innerHTML = "";
    golpes.innerHTML = "";

    botaoSom.hidden = true;
    somPokemon.pause();
    somPokemon.removeAttribute("src");

    resultado.style.display = "none";
}


// ===== BUSCAR DESCRIÇÃO =====

async function buscarDescricao(url) {

    const resposta = await fetch(url);
    const especie = await resposta.json();

    const texto = especie.flavor_text_entries.find(
        item => item.language.name === "en"
    );

    descricao.textContent = texto
        ? texto.flavor_text.replace(/[\n\f]/g, " ")
        : "Descrição não disponível.";

}


// ===== MOSTRAR TIPOS =====

function mostrarTipos(listaTipos) {

    tipos.innerHTML = "";

    listaTipos.forEach(item => {

        const elemento = document.createElement("span");

        elemento.classList.add("tipo");

        elemento.textContent =
            nomesTipos[item.type.name] || item.type.name;

        tipos.appendChild(elemento);

    });

}


// ===== MOSTRAR HABILIDADES =====

function mostrarHabilidades(listaHabilidades) {

    habilidades.innerHTML = "";

    const lista = document.createElement("div");
    lista.classList.add("lista-detalhes");

    listaHabilidades.forEach(item => {

        const elemento = document.createElement("span");

        elemento.classList.add("item-detalhe");

        let nome = item.ability.name.replace(/-/g, " ");

        if (item.is_hidden) {
            nome += " (oculta)";
        }

        elemento.textContent = nome;

        lista.appendChild(elemento);

    });

    habilidades.appendChild(lista);

}


// ===== MOSTRAR ESTATÍSTICAS =====

function mostrarEstatisticas(listaStatus) {

    estatisticas.innerHTML = "";

    listaStatus.forEach(item => {

        const valor = item.base_stat;

        const nome =
            nomesStatus[item.stat.name] || item.stat.name;

        const porcentagem = Math.min((valor / 255) * 100, 100);

        const elemento = document.createElement("div");

        elemento.classList.add("stat-item");

        const cabecalho = document.createElement("div");
        cabecalho.classList.add("stat-cabecalho");

        const nomeStat = document.createElement("span");
        nomeStat.textContent = nome;

        const valorStat = document.createElement("strong");
        valorStat.textContent = valor;

        cabecalho.append(nomeStat, valorStat);

        const barra = document.createElement("div");
        barra.classList.add("stat-barra");

        const progresso = document.createElement("div");
        progresso.classList.add("stat-progresso");
        progresso.style.width = `${porcentagem}%`;

        barra.appendChild(progresso);

        elemento.append(cabecalho, barra);

        estatisticas.appendChild(elemento);

    });

}


// ===== MOSTRAR GOLPES =====

function mostrarGolpes(listaGolpes) {

    golpes.innerHTML = "";

    const lista = document.createElement("div");
    lista.classList.add("lista-detalhes");

    listaGolpes.slice(0, 10).forEach(item => {

        const elemento = document.createElement("span");

        elemento.classList.add("item-detalhe");

        elemento.textContent =
            item.move.name.replace(/-/g, " ");

        lista.appendChild(elemento);

    });

    golpes.appendChild(lista);

}


// ===== BUSCAR POKÉMON =====

formulario.addEventListener("submit", async function (evento) {

    evento.preventDefault();

    const id = document.getElementById("idPoke").value.trim();

    limparResultado();

    mensagem.textContent = "Buscando Pokémon...";

    try {

        const resposta = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`
        );

        if (!resposta.ok) {
            throw new Error("Pokémon não encontrado!");
        }

        const pokemon = await resposta.json();

        // IDENTIFICAÇÃO

        nomePokemon.textContent = pokemon.name;

        numeroPokemon.textContent =
            `Nº ${String(pokemon.id).padStart(4, "0")}`;

        // IMAGEM

        imgPokemon.src =
            pokemon.sprites.other["official-artwork"].front_default
            || pokemon.sprites.front_default;

        imgPokemon.alt = `Imagem de ${pokemon.name}`;

        // TIPOS

        mostrarTipos(pokemon.types);

        // INFORMAÇÕES BÁSICAS

        altura.textContent = `${pokemon.height / 10} m`;
        peso.textContent = `${pokemon.weight / 10} kg`;

        basePokemon.textContent =
            pokemon.base_experience ?? "Não disponível";

        // HABILIDADES

        mostrarHabilidades(pokemon.abilities);

        // ATRIBUTOS

        mostrarEstatisticas(pokemon.stats);

        // GOLPES

        mostrarGolpes(pokemon.moves);

        // DESCRIÇÃO

        await buscarDescricao(pokemon.species.url);

        // SOM

        const som = pokemon.cries.latest;

        if (som) {
            somPokemon.src = som;
            botaoSom.hidden = false;
        }

        // EXIBIR RESULTADO

        resultado.style.display = "block";

        mensagem.textContent = "Pokémon encontrado!";

    } catch (erro) {

        limparResultado();

        mensagem.textContent =
            "Pokémon não encontrado. Verifique o ID e tente novamente.";

        console.error(erro);

    }

});


// ===== REPRODUZIR SOM =====

botaoSom.addEventListener("click", function () {

    somPokemon.play();

});

