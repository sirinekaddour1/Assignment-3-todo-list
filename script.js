// 1. RÉCUPÉRER LES ÉLÉMENTS DU HTML

// Cherche l'élément qui a l'id "taskInput"
const taskInput = document.querySelector("#taskInput");

// Cherche le bouton Add
const addButton = document.querySelector("#addButton");

// Cherche la liste <ul> des tâches non terminées
const pendingTaskList = document.querySelector("#pendingTaskList");

// Cherche la liste <ul> des tâches terminées
const completedTaskList = document.querySelector("#completedTaskList");

// Cherche le paragraphe utilisé pour afficher un message d'erreur
const message = document.querySelector("#message");


// 2. TABLEAU QUI CONTIENT LES TÂCHES

// On appelle la fonction load() pour récupérer les anciennes tâches enregistrées dans localStorage
let tasks = load();


// 3. CHARGER LES TÂCHES DU LOCALSTORAGE

function load() {

    // cherche une donnée enregistrée sous le nom "tasks"
    const raw = localStorage.getItem("tasks");

    // transforme le texte du localStorage en tableau JavaScript
    // || [] veut dire que si aucune donnée n'existe encore, utiliser un tableau vide
    return JSON.parse(raw) || [];
}


// 4. SAUVEGARDER LES TÂCHES

function save() {

    // localStorage ne peut stocker que du texte donc on transforme le tableau tasks en texte JSON
    const json = JSON.stringify(tasks);

    // Enregistre le texte dans localStorage
    localStorage.setItem("tasks", json);
}


// 5. AJOUTER UNE TÂCHE

function addTask() {

    // .value récupère ce que l'utilisateur a écrit dans l'input
    // .trim() enlève les espaces inutiles au début et à la fin
    const title = taskInput.value.trim();

    // Vérifie si l'utilisateur n'a rien écrit
    if (title === "") {

        message.textContent = "Please enter a task.";

        return;
    }

    // Création d'un objet représentant une tâche
    const task = {

        // Date.now() crée un nombre unique
        id: Date.now(),

        title: title,

        // Au début, la tâche n'est pas terminée
        completed: false
    };

    // Ajoute la nouvelle tâche à la fin du tableau tasks
    tasks.push(task);

    // Sauvegarde le nouveau tableau dans localStorage
    save();

    // Réaffiche les tâches
    renderTasks();

    // Vide le champ input après l'ajout
    taskInput.value = "";

    // Efface le message d'erreur
    message.textContent = "";
}


// 6. AFFICHER LES TÂCHES

function renderTasks() {

    // Vide les deux listes avant de les reconstruire
    pendingTaskList.innerHTML = "";
    completedTaskList.innerHTML = "";

    // Parcourt toutes les tâches
    tasks.forEach(task => {

        // Transforme la tâche en élément HTML
        const element = createTaskElement(task);

        // Si la tâche est terminée
        if (task.completed) {

            // Ajoute la tâche dans Completed Tasks
            completedTaskList.append(element);

        } else {

            // Sinon, ajoute la tâche dans Pending Tasks
            pendingTaskList.append(element);
        }
    });
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

        // Si oui, ajoute la classe CSS "completed"
        span.classList.add("completed");
    }


    // Crée un bouton
    const deleteButton = document.createElement("button");

    // Texte affiché dans le bouton
    deleteButton.textContent = "Delete";

    // Ajoute la classe CSS du bouton
    deleteButton.classList.add("delete-button");

    // Ajoute data-action="delete"
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

    // Garde toutes les tâches sauf celle qu'on veut supprimer
    tasks = tasks.filter(task => task.id !== id);

    // Sauvegarde le tableau après suppression
    save();

    // Réaffiche les listes
    renderTasks();
}


// 9. TERMINER / RÉACTIVER UNE TÂCHE

function toggleTask(id) {

    tasks = tasks.map(task => {

        // Vérifie si c'est la tâche qu'on a cliquée
        if (task.id === id) {

            return {
                ...task, // copie toutes les anciennes informations

                // false devient true et true devient false
                completed: !task.completed
            };
        }

        // Si ce n'est pas la tâche cliquée, on la retourne sans modification
        return task;
    });

    // Sauvegarde les changements
    save();

    // Réaffiche les listes
    renderTasks();
}


// 10. CLIC SUR LE BOUTON ADD

// Quand on clique sur le bouton Add, la fonction addTask est exécutée
addButton.addEventListener("click", addTask);


// 11. AJOUTER UNE TÂCHE AVEC ENTER

// Écoute le clavier dans le champ input
taskInput.addEventListener("keydown", function (event) {

    // Si la touche utilisée est Enter
    if (event.key === "Enter") {

        addTask();
    }
});


// 12. GÉRER LES CLICS SUR LES TÂCHES

// Cette fonction sera utilisée pour les deux listes
function handleTaskClick(event) {

    // Trouve le <li> correspondant à la tâche cliquée
    const li = event.target.closest("li");

    // Si aucun <li> n'est trouvé, on arrête
    if (!li) {

        return;
    }

    // Récupère l'id stocké dans data-id
    // Number() transforme le texte en nombre
    const id = Number(li.dataset.id);


    // Vérifie si on a cliqué sur le bouton Delete
    if (event.target.dataset.action === "delete") {

        // Supprime la tâche
        deleteTask(id);

        return;
    }


    // Sinon, change l'état completed de la tâche
    toggleTask(id);
}


// Gère les clics dans Pending Tasks
pendingTaskList.addEventListener("click", handleTaskClick);

// Gère les clics dans Completed Tasks
completedTaskList.addEventListener("click", handleTaskClick);


// 13. AFFICHER LES TÂCHES AU DÉMARRAGE

// Quand la page s'ouvre, affiche les tâches déjà chargées
renderTasks();