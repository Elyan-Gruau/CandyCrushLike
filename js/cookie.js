import Grille from "./grille.js";

let lastID = 0;
export default class Cookie {
  ligne=0;
  colone=0;
  type=0;
  htmlImage=undefined;
  isSelected = false;
  ID = -1;

  static urlsImagesNormales = [
    "./assets/images/Croissant@2x.png",
    "./assets/images/Cupcake@2x.png",
    "./assets/images/Danish@2x.png",
    "./assets/images/Donut@2x.png",
    "./assets/images/Macaroon@2x.png",
    "./assets/images/SugarCookie@2x.png",
  ];
  static urlsImagesSurlignees = [
    "./assets/images/Croissant-Highlighted@2x.png",
    "./assets/images/Cupcake-Highlighted@2x.png",
    "./assets/images/Danish-Highlighted@2x.png",
    "./assets/images/Donut-Highlighted@2x.png",
    "./assets/images/Macaroon-Highlighted@2x.png",
    "./assets/images/SugarCookie-Highlighted@2x.png",
  ];
  static urlImagesSpéciales =[
      "./assets/images/"
  ]

  constructor(type, ligne, colonne) {
    this.type = type;
    this.ligne = ligne;
    this.colonne = colonne;
    this.ID = lastID ++;

    // On récupère l'URL de l'image correspondant au type
    // qui est un nombre entre 0 et 5
    const url = Cookie.urlsImagesNormales[type];

    // On crée une image HTML avec l'API du DOM
    let img = document.createElement("img");
    img.src = url;
    img.width = 80;
    img.height = 80;
    // pour pouvoir récupérer la ligne et la colonne
    // quand on cliquera sur une image et donc à partir
    // de cette ligne et colonne on pourra récupérer le cookie
    // On utilise la dataset API du DOM, qui permet de stocker
    // des données arbitraires dans un élément HTML
    img.dataset.ligne = ligne;
    img.dataset.colonne = colonne;

    // On stocke l'image dans l'objet cookie
    this.htmlImage = img;
  }

  selectionnee() {
    // on change l'image et la classe CSS
    // A FAIRE
    if (!this.isSelected && Grille.canSelectCookie()){
      this.htmlImage.classList.add('cookies-selected');
      this.htmlImage.src = Cookie.urlsImagesSurlignees[this.type];
      Grille.addSelectedCookie(this);
      this.isSelected = true;
    }else{
      this.deselectionnee();
    }
  }

  deselectionnee() {
    // on change l'image et la classe CSS
    // A FAIRE

    if (this.isSelected){
      // console.log('deselectionnee')
      Grille.removeSelectedCookie(this);
      this.htmlImage.classList.remove('cookies-selected');
      this.htmlImage.src = Cookie.urlsImagesNormales[this.type];
      this.isSelected = false;
    }
  }

  static swapCookies(c1, c2) {
    // A FAIRE
    console.log("SWAP C1 C2");
    // On échange leurs images et types
    let tmpCookie = {
      type : c1.type,
      htmlImage : c1.htmlImage,
      ID : c1.id
    }

    let typeTmp = c1.type;


    c1.type = c2.type;
    // c1.htmlImage = c2.htmlImage;
    // c1.ID = c2.ID;

    c2.type =  typeTmp;
    // c2.htmlImage = tmpCookie.htmlImage;
    // c2.ID = tmpCookie.ID;

    c1.deselectionnee();
    c2.deselectionnee();

    // c1.render();
    // c2.render();

    // et on remet les images correspondant au look
    // "désélectionné"
  }

  /** renvoie la distance au sens "nombre de cases" 
   * entre deux cookies. Servira pour savoir si on peut
   * swapper deux cookies */
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    const distance = Math.sqrt((c2 - c1) * (c2 - c1) + (l2 - l1) * (l2 - l1));
    console.log("Distance = " + distance);
    return distance;
  }

  render(){
    const url = Cookie.urlsImagesNormales[this.type];
    this.htmlImage = document.createElement("img");
    console.log("render")
  }

  isPopped(){
    return this.htmlImage.classList.contains("cookies-popped");
  }

  pop(){
    this.htmlImage.classList.add('cookies-popped');
  }
  unpop(){
    this.htmlImage.classList.remove('cookies-popped');
  }

  highlight(){
    this.htmlImage.src = Cookie.urlsImagesSurlignees[this.type];
  }

  unhighlight(){
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type];
  }
}
