
// ===== SELECIONAR ELEMENTOS =====

const formulario = document.getElementById("formPage");

const mensagem = document.getElementById("msg");

const nomePokemon = document.getElementById("nomePokemon");

const imgPokemon = document.getElementById("imgPoke");

const basePokemon = document.getElementById("basePoke");


// ===== BUSCAR POKÉMON =====

formulario.addEventListener("submit", async function (evento) {

    evento.preventDefault();

    const id = document.getElementById("idPoke").value;

    mensagem.textContent = "Buscando Pokémon...";

    nomePokemon.textContent = "";

    imgPokemon.src = "";

    basePokemon.textContent = "";

    try {

        const resposta = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`
        );

        if (!resposta.ok) {
            throw new Error("Pokémon não encontrado!");
        }

        const pokemon = await resposta.json();

        // Nome do Pokémon
        nomePokemon.textContent = pokemon.name;

        // Imagem do Pokémon
        imgPokemon.src = pokemon.sprites.front_default;

        // Experiência base
        basePokemon.textContent =
            `Experiência base: ${pokemon.base_experience}`;

        mensagem.textContent = "Pokémon encontrado!";

    }

    catch (erro) {

        mensagem.textContent = "Pokémon não encontrado. Tente outro ID.";

        nomePokemon.textContent = "";

        imgPokemon.src = "";

        basePokemon.textContent = "";

    }

});
