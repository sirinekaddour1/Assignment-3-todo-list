// 1. RÉCUPÉRER LES ÉLÉMENTS DU HTML

// Cherche l'élément qui a l'id "taskInput"
const taskInput = document.querySelector("#taskInput");

// Cherche le bouton Add
const addButton = document.querySelector("#addButton");

// Cherche la liste <ul> où les tâches seront affichées
const taskList = document.querySelector("#taskList");

// Cherche le paragraphe utilisé pour afficher un message d'erreur
const message = document.querySelector("#message");

// 2. TABLEAU QUI CONTIENT LES TÂCHES

// On appelle la fonction load() pour récupérer les anciennes tâches enregistrées dans localStorage
let tasks = load();

// 3. CHARGER LES TÂCHES DU LOCALSTORAGE

function load() {
    // cherche une donnée enregistrée sous le nom "tasks"
    const raw = localStorage.getItem("tasks");
    // transforme le texte du localStorage en tableau JavaScript. || [] veut dire que si aucune donnée n'existe encore, utiliser un tableau vide
    return JSON.parse(raw) || [];
}

// 4. SAUVEGARDER LES TÂCHES
function save() {

    // localStorage ne peut stocker que du texte donc on transforme le tableau tasks en texte JSON
    const json = JSON.stringify(tasks);

    // Enregistre le texte dans localStorage. "tasks" est le nom utilisé pour retrouver les données plus tard
    localStorage.setItem("tasks", json);
}

// 5. AJOUTER UNE TÂCHE

function addTask() {

    // .value récupère ce que l'utilisateur a écrit dans l'input. Et .trim() enlève les espaces inutiles au début et à la fin
    const title = taskInput.value.trim();

    // Vérifie si l'utilisateur n'a rien écrit
    if (title === "") {

        message.textContent = "Please enter a task."; // Affiche un message d'erreur
        return;
    }

    // Création d'un objet représentant une tâche
    const task = {

        // Date.now() crée un nombre unique basé sur l'heure actuelle
        id: Date.now(),
        title: title,

        // Au début, la tâche n'est pas terminée
        completed: false
    };

    tasks.push(task);  // Ajoute la nouvelle tâche à la fin du tableau tasks
    save();  // Sauvegarde le nouveau tableau dans localStorage
    renderTasks(); // Réaffiche toutes les tâches à l'écran
    taskInput.value = ""; // Vide le champ input après l'ajout
    message.textContent = ""; // Efface le message d'erreur s'il y en avait un
}

// 6. AFFICHER LES TÂCHES

function renderTasks() {

    // Vide complètement la liste HTML avant de la reconstruire
    taskList.innerHTML = "";

    // .map() parcourt chaque tâche du tableau et transforme chaque tâche en élément HTML
    tasks
        .map(task => createTaskElement(task))

        // .forEach() parcourt chaque élément HTML créé et l'ajoute dans la liste <ul>
        .forEach(element => taskList.append(element));
}

// 7. CRÉER L'ÉLÉMENT HTML D'UNE TÂCHE

function createTaskElement(task) {

    // Crée un nouvel élément <li>
    const li = document.createElement("li");

    // Ajoute la classe CSS "task"
    li.classList.add("task");

    // Enregistre l'id de la tâche dans l'élément HTML
    li.dataset.id = task.id;


    // Crée un élément <span> qui contiendra le texte de la tâche
    const span = document.createElement("span");

    // Met le titre de la tâche dans le span
    span.textContent = task.title;

    // Ajoute la classe CSS "task-text"
    span.classList.add("task-text");

    // Vérifie si la tâche est terminée
    if (task.completed) {

        // Si oui, ajoute la classe CSS "completed". Cette classe barre le texte
        span.classList.add("completed");
    }

    // Crée un bouton
    const deleteButton = document.createElement("button");

    // Texte affiché dans le bouton
    deleteButton.textContent = "Delete";

    // Ajoute la classe CSS du bouton
    deleteButton.classList.add("delete-button");

    // Ajoute une information data-action="delete". Elle nous permettra de savoir qu'on a cliqué sur Delete
    deleteButton.dataset.action = "delete";

    // Ajoute le span dans le <li>
    li.append(span);

    // Ajoute le bouton Delete dans le <li>
    li.append(deleteButton);

    // Retourne l'élément <li> terminé
    return li;
}

// 8. SUPPRIMER UNE TÂCHE

function deleteTask(id) {

    // .filter() crée un nouveau tableau en gardant uniquement les tâches dont l'id est différent de l'id qu'on veut supprimer
    tasks = tasks.filter(task => task.id !== id);

    // Sauvegarde le tableau après suppression
    save();

    // Réaffiche la liste
    renderTasks();
}

// 9. TERMINER / RÉACTIVER UNE TÂCHE

function toggleTask(id) {

    tasks = tasks.map(task => {

        // Vérifie si c'est la tâche qu'on a cliquée
        if (task.id === id) {

            // Retourne une copie de la tâche
            return {
                ...task, // copie toutes les anciennes informations
                completed: !task.completed // Inverse la valeur de completed false devient true eet true devient false
            };
        }

        return task; // Si ce n'est pas la tâche cliquée, on la retourne sans modification
    });

    // Sauvegarde les changements
    save();
    renderTasks();
}

// 10. CLIC SUR LE BOUTON ADD

addButton.addEventListener("click", addTask); // quand on clique sur le bouton Add, la fonction addTask est exécutée

// 11. AJOUTER UNE TÂCHE AVEC ENTER

// Écoute le clavier dans le champ input
taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") { // event.key contient la touche utilisée
        addTask();
    }
});


// 12. GÉRER LES CLICS SUR LA LISTE

// on met un seul listener sur la liste entière
taskList.addEventListener("click", function (event) {

    const li = event.target.closest("li");     // event.target = l'élément exact qui a été cliqué

    if (!li) { // Si on a cliqué dans une zone qui n'est pas une tâche, on arrête la fonction

        return;
    }

    const id = Number(li.dataset.id); // Récupère l'id stocké dans data-id
    // dataset donne du texte, donc Number() le transforme en nombre

    if (event.target.dataset.action === "delete") { // Vérifie si l'élément cliqué possède data-action="delete"

        // Supprime la tâche
        deleteTask(id);
        return;
    }


    // Si on n'a pas cliqué sur Delete, alors on change l'état completed
    toggleTask(id);
});


// 13. AFFICHER LES TÂCHES AU DÉMARRAGE

renderTasks(); // Quand la page s'ouvre, affiche immédiatement les tâches déjà chargées
