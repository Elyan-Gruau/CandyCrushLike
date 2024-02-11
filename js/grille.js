import Cookie from "./cookie.js";
import {create2DArray} from "./utils.js";

/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
let coups = 0;
let score = 0;
let level = 0;
let multiplier = 1;

const startCookieNumber = 4;
const maxLevel = 5;

export default class Grille {
  /**
   * Constructeur de la grille
   * @param {number} l nombre de lignes
   * @param {number} c nombre de colonnes
   */
  static selectedCookies = [];
  constructor(l, c) {
    this.c = c;
    this.l = l;

    this.tabcookies = this.remplirTableauDeCookies(startCookieNumber + level);
  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      // on calcule la ligne et la colonne de la case
      // index est le numéro de la case dans la grille
      // on sait que chaque ligne contient this.c colonnes
      // er this.l lignes
      // on peut en déduire la ligne et la colonne
      // par exemple si on a 9 cases par ligne et qu'on 
      // est à l'index 4
      // on est sur la ligne 0 (car 4/9 = 0) et 
      // la colonne 4 (car 4%9 = 4)
      let ligne = Math.floor(index / this.l);
      let colonne = index % this.c; 

      //console.log("On remplit le div index=" + index + " l=" + ligne + " col=" + colonne);

      // on récupère le cookie correspondant à cette case
      let cookie = this.tabcookies[ligne][colonne];
      // on récupère l'image correspondante
      let img = cookie.htmlImage;

      img.onclick = (event) => {
        console.log("On a cliqué sur la l :" + ligne + " c :" + colonne);
        //let cookieCliquee = this.getCookieFromLC(ligne, colonne);
        console.log("Le cookie cliqué est de type " + cookie.type);
        cookie.selectionnee();

        // A FAIRE : tester combien de cookies sont sélectionnées
        // si 0 on ajoute le cookie cliqué au tableau
        // si 1 on ajoute le cookie cliqué au tableau
        // et on essaie de swapper
        if (Grille.selectedCookies.length === 2){ //Swap
          if (Cookie.distance(Grille.selectedCookies[0],Grille.selectedCookies[1])>1){
            Grille.selectedCookies[1].deselectionnee();
          }else{
            setTimeout( () => {
              Cookie.swapCookies(Grille.selectedCookies[0],Grille.selectedCookies[1])
              increaseCoups();
              this.checkAlignement();
            },200);
          }
        }
      }

      // A FAIRE : ecouteur de drag'n'drop

      // on affiche l'image dans le div pour la faire apparaitre à l'écran.
      div.appendChild(img);
    });
  }

  // inutile ?
  getCookieFromLC(ligne, colonne) {
    return this.tabcookies[ligne][colonne];
  }

  setCookieFromLC(ligne, colonne, cookie) {
    this.tabcookies[ligne][colonne].type = cookie.type;
  }
  
  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  remplirTableauDeCookies(nbDeCookiesDifferents) {
    // créer un tableau vide de 9 cases pour une ligne
    // en JavaScript on ne sait pas créer de matrices
    // d'un coup. Pas de new tab[3][4] par exemple.
    // Il faut créer un tableau vide et ensuite remplir
    // chaque case avec un autre tableau vide
    // Faites ctrl-click sur la fonction create2DArray
    // pour voir comment elle fonctionne
    let tab = create2DArray(9);

    // remplir
    for(let l = 0; l < this.l; l++) {
      for(let c =0; c < this.c; c++) {
        tab[l][c] = this.createNewRandomCookie(nbDeCookiesDifferents,l,c);
      }
    }

    return tab;
  }

  createNewRandomCookie(nbDeCookiesDifferents,l,c){
    const type = Math.floor(Math.random()*nbDeCookiesDifferents);
    //console.log(type)
    return new Cookie(type, l, c);
  }


  static addSelectedCookie(cookie){
    Grille.selectedCookies.push(cookie);
  }

  static removeSelectedCookie(cookie){
    let index = -1;

    for (let i=0; i<Grille.selectedCookies.length; i++) {
      if (Grille.selectedCookies[i].ID === cookie.ID) {
        index = i;
        break;
      }
    }
      if (index !== -1) {
        const halfBeforeTheUnwantedElement = Grille.selectedCookies.slice(0, index);
        const halfAfterTheUnwantedElement = Grille.selectedCookies.slice(index + 1);

        Grille.selectedCookies = halfBeforeTheUnwantedElement.concat(halfAfterTheUnwantedElement);
      }else{
        console.log("Can't delete object: " + cookie);
      }
    }


  static canSelectCookie(){
    return Grille.selectedCookies.length < 2; //todo put in constant
  }

  checkAlignement(){
    console.log("checking alignement")
    let hasAlignement = this.checkAlignmentVertical();
    hasAlignement = hasAlignement || this.checkAlignmentHorizontal();
    if (hasAlignement){
      // console.log("do fall")
      multiplier *= 2;
      this.fall();
      setTimeout(() => {
        this.checkAlignement()
      },1500);
    }else{
      multiplier = 1;
    }
  }

  fall(){
    console.log("falling")

    const newCookieTab = this.remplirTableauDeCookies(startCookieNumber + level);

    for (let col = 0; col <this.c;col++){
      //trouver les trous
      //TODO garder la méthode de l'enregistrement des cookie encore en vie, et recréer une nouvelle grille avec.
      let toKeep = [];
      for (let lin = 0; lin <this.l;lin++) {
        const cookie = this.getCookieFromLC(lin, col);
        if (!cookie.isPopped()) {
          toKeep.push(cookie);
        }
      }

      let lineToInsert = this.l;
      //Ajouter les anciens cookies aux nouveaux
      for (let i = toKeep.length-1; 0 <= i ; i--) {
        lineToInsert--;
        let newCookie = toKeep[i];
        newCookie.colonne = col;
        newCookie.ligne = lineToInsert;
        newCookieTab[lineToInsert][col] = newCookie;
        // newCookie.highlight();
      }
    }
    this.tabcookies =  newCookieTab;
    setTimeout(() => {
      this.refresh();
      // this.checkAlignement();
    },1000);

    // this.refresh();
  }

  checkAlignmentVertical(){
    //Verical
    let verCookiesAligned = [];
    let verAlignType = -1;
    let hasAlignment = false;
    for (let col = 0; col <this.c;col++){
      for (let lin = 0; lin <this.l;lin++){
        const cookie = this.tabcookies[lin][col];
        if (cookie.type !== verAlignType){
          if (verCookiesAligned.length>=3){
            console.log("align :"+verCookiesAligned.length)
            addScore(verCookiesAligned.length - 2);
            this.popCookies(verCookiesAligned);
            hasAlignment = true;
          }
          verAlignType = cookie.type;
          verCookiesAligned.length = 0;
        }
        if (cookie.type === verAlignType){
          verCookiesAligned.push(cookie);
        }
      }
      verAlignType = -1;
    }
    return hasAlignment;
  }

  checkAlignmentHorizontal(){
    let horCookiesAligned = [];
    let horAlignType = -1;
    let hasAlignment = false;
    for (let lin = 0; lin <this.l;lin++){
      for (let col = 0; col <this.c;col++){
        const cookie = this.tabcookies[lin][col];
        if (cookie.type !== horAlignType){
          if (horCookiesAligned.length>=3){
            console.log("align :"+horCookiesAligned.length)
            addScore(horCookiesAligned.length - 2);
            this.popCookies(horCookiesAligned);
            hasAlignment = true;
          }
          horAlignType = cookie.type;
          horCookiesAligned.length = 0;
        }
        if (cookie.type === horAlignType){
          // horAlignCount++;
          horCookiesAligned.push(cookie);
        }
      }
      horAlignType = -1;
    }
    return hasAlignment;
  }

  popCookies(cookies){
    for (let i = 0; i < cookies.length; i++){
      const cookie = cookies[i];
      cookie.pop();
      console.log("L:"+cookie.ligne +" C:"+ cookie.colonne);
    }
  }

  refresh(){
    let caseDivs = document.querySelectorAll("#grille div");
    caseDivs.forEach((div, index) => {
      div.innerHTML = '';
    });
    this.showCookies();
  }
}

function addScore(amount){
  score += amount * multiplier;
  const scoreElement = document.getElementById("score");
  scoreElement.innerText = "Score:"+score;
  increaseLevel();

}

function increaseCoups(){
  coups ++;
  const coupsElement = document.getElementById("coups");
  coupsElement.innerText = "Coups:"+coups;
}

function increaseLevel(){
  level = parseInt(score / 100);
  if (level > maxLevel) {
    level = maxLevel;
  }
  const levelElement = document.getElementById("level");
  levelElement.innerText = "Niveau:"+level;
}