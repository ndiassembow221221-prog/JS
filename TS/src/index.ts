/*
================================================================================
                         COURS APPROFONDI TYPESCRIPT
================================================================================
Fichier unique : src/index.ts
Environnement : Node.js + TypeScript + tsx

OBJECTIF
- Comprendre ce qui appartient à JavaScript.
- Comprendre ce que TypeScript ajoute.
- Maîtriser les types, fonctions, objets, classes et generics.
- Comprendre les décorateurs modernes.
- Découvrir les API natives JavaScript, Node.js et les bases d'architecture.

LÉGENDE
[JS] : syntaxe ou comportement JavaScript.
[TS] : fonctionnalité de typage ou syntaxe TypeScript.
[JS + TS] : le code s'exécute comme JavaScript, TypeScript vérifie les types.

RÈGLES
1. Les types TypeScript sont effacés à l'exécution.
2. Une interface ne valide pas un JSON reçu d'une API.
3. `as` ne convertit pas une valeur.
4. `unknown` est préférable à `any` pour une donnée inconnue.
5. Node.js et le navigateur n'ont pas les mêmes API.
6. Lis une section, exécute, modifie, provoque une erreur, corrige.
================================================================================

// 01. POINT D'ENTRÉE
// [JS] console.log existe en JavaScript.
// [TS] Le compilateur vérifie les types avant l'exécution.
console.log("Début du cours TypeScript");


// 02. VARIABLES
// [JS + TS] let : variable réaffectable.
// [JS + TS] const : liaison non réaffectable.
// [JS + TS] var : ancienne déclaration à portée de fonction, souvent évitée.
let compteur: number = 0;
compteur++;
const application: string = "Cours TypeScript";
console.log(compteur, application);


// 03. TYPES PRIMITIFS
const prenom: string = "Awa";
const age: number = 22;
const actif: boolean = true;
const grandNombre: bigint = 9007199254740993n;
const symbole: symbol = Symbol("id");
const valeurNulle: null = null;
const valeurIndefinie: undefined = undefined;
console.log(prenom, age, actif, grandNombre, symbole, valeurNulle, valeurIndefinie);


// 04. INFÉRENCE
// TypeScript déduit le type à partir de la valeur.
let villeDeduite = "Dakar";       // string
let populationDeduite = 100000;   // number
let actifDeduit = false;          // boolean
// villeDeduite = 123; // Erreur : villeDeduite est une string.


// 05. ANY
// [TS] any désactive une grande partie de la vérification.
let valeurAny: any = "texte";
valeurAny = 42;
valeurAny = { actif: true };


// 06. UNKNOWN
// [TS] unknown accepte toute valeur, mais oblige à vérifier avant usage.
let valeurUnknown: unknown = "Bonjour";
if (typeof valeurUnknown === "string") {
    console.log(valeurUnknown.toUpperCase());
}


// 07. VOID
// [TS] void décrit une fonction sans résultat utile.
function afficherMessage(message: string): void {
    console.log(message);
}
afficherMessage("Fonction void");


// 08. NEVER
// [TS] never représente une valeur impossible ou une fonction qui ne termine
// pas normalement.
function echouer(message: string): never {
    throw new Error(message);
}


// 09. TABLEAUX
// [JS] Les tableaux sont natifs.
// [TS] On peut typer les éléments.
const notes: number[] = [12, 15, 18];
const noms: Array<string> = ["Ali", "Awa"];
const mixte: (string | number)[] = ["A", 1, "B", 2];
console.log(notes.map(note => note * 2));
console.log(notes.filter(note => note >= 15));
console.log(notes.reduce((total, note) => total + note, 0));


// 10. TUPLES
// [TS] Tuple : types déterminés selon les positions.
const utilisateurTuple: [number, string, boolean] = [1, "Moussa", true];
const [tupleId, tupleNom, tupleActif] = utilisateurTuple;
console.log(tupleId, tupleNom, tupleActif);


// 11. READONLY ARRAY
const listeFixe: readonly number[] = [1, 2, 3];
// listeFixe.push(4); // Erreur : tableau readonly.


// 12. ENUM
// [TS] enum définit un ensemble de constantes nommées.
enum EtatCommande {
    EnAttente = "EN_ATTENTE",
    Payee = "PAYEE",
    Annulee = "ANNULEE"
}
const etat: EtatCommande = EtatCommande.EnAttente;
console.log(etat);


// 13. UNION
// [TS] Une union autorise plusieurs types.
let reference: number | string = 100;
reference = "USR-100";

function afficherReference(valeur: number | string): string {
    if (typeof valeur === "string") return valeur.toUpperCase();
    return valeur.toFixed(0);
}
console.log(afficherReference(reference));


// 14. LITERAL TYPES
type Role = "admin" | "formateur" | "apprenant";
let role: Role = "admin";
// role = "visiteur"; // Erreur.


// 15. TYPE ALIAS
// [TS] type donne un nom à un type.
type Adresse = {
    rue: string;
    ville: string;
    codePostal?: string;
};

type Profil = {
    readonly id: number;
    nom: string;
    email: string;
    adresse: Adresse;
};

const profil: Profil = {
    id: 1,
    nom: "Fatou",
    email: "fatou@example.com",
    adresse: { rue: "Rue 10", ville: "Dakar" }
};


// 16. INTERFACE
// [TS] Une interface décrit un contrat de structure.
// Elle n'existe pas à l'exécution.
interface Utilisateur {
    id: number;
    nom: string;
    email: string;
    actif?: boolean;
}

const utilisateur: Utilisateur = {
    id: 1,
    nom: "Ali",
    email: "ali@example.com"
};


// 17. EXTENSION D'INTERFACE
interface Administrateur extends Utilisateur {
    permissions: string[];
}

const admin: Administrateur = {
    id: 2,
    nom: "Awa",
    email: "awa@example.com",
    permissions: ["lire", "créer"]
};


// 18. INTERSECTION
type AvecNom = { nom: string };
type AvecAge = { age: number };
type PersonneComplete = AvecNom & AvecAge;
const personneComplete: PersonneComplete = { nom: "Moussa", age: 24 };


// 19. TYPE VS INTERFACE
// interface : contrat d'objet, extension et fusion de déclarations.
// type : alias, union, intersection, tuple, types conditionnels.
// Les deux peuvent décrire la forme d'un objet.


// 20. FONCTION TYpÉE
function addition(a: number, b: number): number {
    return a + b;
}
console.log(addition(10, 20));


// 21. FONCTION SANS RETOUR
function notifier(message: string): void {
    console.log("Notification :", message);
}


// 22. PARAMÈTRE OPTIONNEL
function presenter(nom: string, age?: number): string {
    return age === undefined ? nom : `${nom}, ${age} ans`;
}


// 23. PARAMÈTRE PAR DÉFAUT
function saluer(nom: string = "visiteur"): string {
    return `Bonjour ${nom}`;
}


// 24. REST PARAMETERS
function somme(...valeurs: number[]): number {
    return valeurs.reduce((total, valeur) => total + valeur, 0);
}


// 25. FONCTION FLÉCHÉE
// [JS] La fonction fléchée existe en JavaScript.
// [TS] On ajoute les annotations.
const multiplier = (a: number, b: number): number => a * b;


// 26. CALLBACK
type Operation = (a: number, b: number) => number;

function executerOperation(
    a: number,
    b: number,
    operation: Operation
): number {
    return operation(a, b);
}
console.log(executerOperation(10, 5, addition));


// 27. TYPE DE FONCTION
type Salutation = (nom: string) => string;
const bonjour: Salutation = nom => `Bonjour ${nom}`;


// 28. OVERLOADS
// [TS] Plusieurs signatures publiques, une seule implémentation.
function convertir(valeur: string): number;
function convertir(valeur: number): string;
function convertir(valeur: string | number): string | number {
    return typeof valeur === "string" ? Number(valeur) : String(valeur);
}
const valeurConvertie = convertir("123");


// 29. TYPE NARROWING
function traiter(valeur: string | number): string {
    if (typeof valeur === "string") return valeur.toUpperCase();
    return valeur.toFixed(2);
}


// 30. INSTANCEOF
class DateSpeciale {
    constructor(public date: Date) {}
}
function afficherDate(date: Date | DateSpeciale): string {
    if (date instanceof DateSpeciale) return date.date.toISOString();
    return date.toISOString();
}


// 31. IN OPERATOR
type ReponseOK = { data: string };
type ReponseKO = { error: string };
function afficherReponse(reponse: ReponseOK | ReponseKO): string {
    return "data" in reponse ? reponse.data : reponse.error;
}


// 32. TYPE GUARD
function estTexte(value: unknown): value is string {
    return typeof value === "string";
}
if (estTexte(valeurUnknown)) {
    console.log(valeurUnknown.toUpperCase());
}


// 33. ASSERTION
// [TS] as indique un type au compilateur.
// Ce n'est pas une conversion runtime.
const assertionTexte = "123" as string;
const conversionNombre = Number("123");


// 34. NON-NULL ASSERTION
// Le ! indique au compilateur que la valeur n'est pas null.
// Il ne vérifie rien à l'exécution.
// Exemple navigateur : document.querySelector("button")!


// 35. TYPEOF EN POSITION DE TYPE
const configuration = { port: 4000, mode: "dev" };
type Configuration = typeof configuration;


// 36. KEYOF
type ClesConfiguration = keyof Configuration;


// 37. INDEXED ACCESS
type TypePort = Configuration["port"];


// 38. GENERIC
// [TS] T est un paramètre de type qui conserve le type de l'entrée.
function identite<T>(valeur: T): T {
    return valeur;
}
identite<string>("Bonjour");
identite<number>(42);
identite(true);


// 39. GENERIC À CONTRAINTE
function longueur<T extends { length: number }>(valeur: T): number {
    return valeur.length;
}
longueur("TypeScript");
longueur([1, 2, 3]);


// 40. GENERIC AVEC VALEUR PAR DÉFAUT
function envelopper<T = string>(valeur: T): { data: T } {
    return { data: valeur };
}


// 41. INTERFACE GÉNÉRIQUE
interface Depot<T> {
    ajouter(value: T): void;
    tous(): T[];
}


// 42. CLASSE GÉNÉRIQUE
class Boite<T> {
    constructor(private valeur: T) {}
    obtenir(): T { return this.valeur; }
    modifier(valeur: T): void { this.valeur = valeur; }
}
const boite = new Boite<string>("contenu");


// 43. PARTIAL
type ProfilPartiel = Partial<Profil>;


// 44. REQUIRED
type ProfilObligatoire = Required<Profil>;


// 45. READONLY
type ProfilLectureSeule = Readonly<Profil>;


// 46. PICK
type ProfilResume = Pick<Profil, "id" | "nom">;


// 47. OMIT
type ProfilSansEmail = Omit<Profil, "email">;


// 48. RECORD
type Scores = Record<string, number>;
const scores: Scores = { maths: 15, anglais: 17 };


// 49. EXCLUDE ET EXTRACT
type Etat = "attente" | "valide" | "refuse";
type EtatSansRefus = Exclude<Etat, "refuse">;
type EtatValide = Extract<Etat, "valide" | "archive">;


// 50. NONNULLABLE
type ValeurDefinie = NonNullable<string | null | undefined>;


// 51. RETURN TYPE
function obtenirNombre() { return 123; }
type ResultatNombre = ReturnType<typeof obtenirNombre>;


// 52. PARAMETERS
function creerCompte(nom: string, actif: boolean): void {
    console.log(nom, actif);
}
type ArgumentsCompte = Parameters<typeof creerCompte>;


// 53. AWAITED
type ValeurPromise = Awaited<Promise<string>>;


// 54. MAPPED TYPE
type Optionnel<T> = { [K in keyof T]?: T[K] };


// 55. CONDITIONAL TYPE
type EstString<T> = T extends string ? true : false;


// 56. TEMPLATE LITERAL TYPE
type Evenement = `on${Capitalize<"click" | "focus">}`;


// 57. AS CONST
const constantes = { mode: "production", port: 4000 } as const;


// 58. SATISFIES
type ConfigAttendue = { port: number; mode: "dev" | "prod" };
const configVerifiee = { port: 3000, mode: "dev" } satisfies ConfigAttendue;


// 59. CLASSE
// [JS] Les classes sont natives depuis ES2015.
// [TS] Les membres sont typés.
class Personne {
    constructor(public nom: string, public age: number) {}
    presenter(): string { return `${this.nom}, ${this.age} ans`; }
}
const personne = new Personne("Mamadou", 25);


// 60. MODIFICATEURS D'ACCÈS
class Compte {
    public titulaire: string;
    private solde: number;
    protected devise: string;
    readonly numero: string;

    constructor(titulaire: string, solde: number, numero: string) {
        this.titulaire = titulaire;
        this.solde = solde;
        this.devise = "FCFA";
        this.numero = numero;
    }

    deposer(montant: number): void {
        if (montant <= 0) throw new Error("Montant invalide");
        this.solde += montant;
    }

    consulter(): number {
        return this.solde;
    }
}


// 61. PRIVATE TS ET #PRIVATE JS
// private TypeScript est une protection statique.
// #secret JavaScript est privé au runtime.
class Coffre {
    #secret = "secret";
    lire(): string { return this.#secret; }
}


// 62. PARAMETER PROPERTIES
class Etudiant {
    constructor(
        public nom: string,
        private age: number,
        readonly matricule: string
    ) {}
}


// 63. GETTER ET SETTER
class Produit {
    private _prix: number;
    constructor(prix: number) { this._prix = prix; }
    get prix(): number { return this._prix; }
    set prix(valeur: number) {
        if (valeur < 0) throw new Error("Prix invalide");
        this._prix = valeur;
    }
}


// 64. STATIC
class MathUtils {
    static PI = 3.14159;
    static addition(a: number, b: number): number { return a + b; }
}


// 65. HÉRITAGE
class Animal {
    constructor(public nom: string) {}
    parler(): string { return "Son"; }
}
class Chien extends Animal {
    override parler(): string { return `${this.nom} aboie`; }
}


// 66. POLYMORPHISME
const animaux: Animal[] = [new Chien("Rex"), new Animal("Animal")];
animaux.forEach(animal => console.log(animal.parler()));


// 67. ABSTRACT
abstract class Paiement {
    constructor(protected montant: number) {}
    abstract payer(): void;
}
class PaiementCarte extends Paiement {
    override payer(): void { console.log("Carte :", this.montant); }
}


// 68. IMPLEMENTS
interface Exportable {
    exporter(): string;
}
class Rapport implements Exportable {
    exporter(): string { return "Rapport"; }
}


// 69. COMPOSITION
class Moteur {
    demarrer(): void { console.log("Moteur"); }
}
class Voiture {
    constructor(private moteur: Moteur) {}
    demarrer(): void { this.moteur.demarrer(); }
}


// 70. CLASSE GÉNÉRIQUE
class DepotMemoire<T> {
    private elements: T[] = [];
    ajouter(element: T): void { this.elements.push(element); }
    tous(): readonly T[] { return this.elements; }
}


// 71. DECORATEUR MODERNE DE MÉTHODE
// Les décorateurs modernes utilisent la valeur décorée et le contexte.
function journal<This, Args extends unknown[], Return>(
    methode: (this: This, ...args: Args) => Return,
    contexte: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
    return function (this: This, ...args: Args): Return {
        console.log("Appel :", String(contexte.name));
        return methode.call(this, ...args);
    };
}
class Service {
    @journal
    executer(action: string): string { return `Action ${action}`; }
}
console.log(new Service().executer("création"));


// 72. DECORATEUR DE CLASSE
function sceller<T extends abstract new (...args: any[]) => any>(
    classe: T,
    contexte: ClassDecoratorContext<T>
): T {
    Object.seal(classe);
    Object.seal(classe.prototype);
    return classe;
}
@sceller
class ExempleScelle {
    nom = "Exemple";
}


// 73. DECORATEUR DE CHAMP
function prefixe(prefix: string) {
    return function <This>(
        valeur: string,
        contexte: ClassFieldDecoratorContext<This, string>
    ): string {
        return prefix + valeur;
    };
}
class CodeUtilisateur {
    @prefixe("USR-")
    id = "001";
}


// 74. DECORATEUR D'ACCESSOR
function tracerAccessor<This, Value>(
    accessor: ClassAccessorDecoratorTarget<This, Value>,
    contexte: ClassAccessorDecoratorContext<This, Value>
): ClassAccessorDecoratorResult<This, Value> {
    return {
        get(this: This) {
            console.log("Lecture", String(contexte.name));
            return accessor.get.call(this);
        },
        set(this: This, value: Value) {
            console.log("Écriture", String(contexte.name));
            accessor.set.call(this, value);
        }
    };
}
class ProfilAccessor {
    @tracerAccessor
    accessor nom = "Ali";
}


// 75. STRING NATIF
const texte = " TypeScript ";
console.log(texte.trim(), texte.toUpperCase(), texte.includes("Script"));
console.log(texte.replace("Type", "Java"), texte.slice(1, 5));


// 76. NUMBER NATIF
console.log(Number("123"), Number.isInteger(10), Number.isNaN(NaN));


// 77. MATH NATIF
console.log(Math.round(4.6), Math.floor(4.9), Math.ceil(4.1));
console.log(Math.max(1, 5, 3), Math.min(1, 5, 3), Math.random());


// 78. ARRAY NATIF
const nombres = [1, 2, 3, 4];
console.log(nombres.map(n => n * 2));
console.log(nombres.filter(n => n > 2));
console.log(nombres.find(n => n === 3));
console.log(nombres.some(n => n > 3));
console.log(nombres.every(n => n > 0));
console.log(nombres.reduce((a, b) => a + b, 0));


// 79. OBJECT NATIF
const objet = { nom: "Ali", age: 20 };
console.log(Object.keys(objet));
console.log(Object.values(objet));
console.log(Object.entries(objet));
console.log(Object.hasOwn(objet, "nom"));


// 80. MAP
const map = new Map<number, string>();
map.set(1, "un");
console.log(map.get(1), map.has(1));


// 81. SET
const set = new Set<number>([1, 2, 2, 3]);
console.log(set.size, set.has(2));


// 82. DATE
const maintenant = new Date();
console.log(maintenant.toISOString(), maintenant.getFullYear());


// 83. JSON
const json = JSON.stringify(objet);
const parse: unknown = JSON.parse(json);
console.log(json, parse);


// 84. PROMISE
function attendre(): Promise<string> {
    return new Promise(resolve => setTimeout(() => resolve("Terminé"), 10));
}


// 85. ASYNC/AWAIT
async function executerAsync(): Promise<void> {
    const resultat = await attendre();
    console.log(resultat);
}
void executerAsync();


// 86. PROMISE ALL
async function toutesLesPromesses(): Promise<void> {
    const resultats = await Promise.all([
        Promise.resolve(10),
        Promise.resolve(20)
    ]);
    console.log(resultats);
}
void toutesLesPromesses();


// 87. TRY/CATCH
try {
    throw new Error("Erreur de démonstration");
} catch (error: unknown) {
    if (error instanceof Error) console.log(error.message);
}


// 88. RESULT PATTERN
type Resultat<T, E> =
    | { ok: true; valeur: T }
    | { ok: false; erreur: E };


// 89. DISCRIMINATED UNION
type EtatChargement<T> =
    | { statut: "loading" }
    | { statut: "success"; data: T }
    | { statut: "error"; message: string };


// 90. NEVER ET EXHAUSTIVITÉ
function verifierJamais(value: never): never {
    throw new Error(`Cas inattendu ${value}`);
}


// 91. CLOSURE
function creerCompteur(initial: number): () => number {
    let valeur = initial;
    return () => ++valeur;
}
const monCompteur = creerCompteur(0);


// 92. FONCTION D'ORDRE SUPÉRIEUR
function appliquer(value: number, fn: (n: number) => number): number {
    return fn(value);
}


// 93. RECURSION
function factorielle(n: number): number {
    return n <= 1 ? 1 : n * factorielle(n - 1);
}


// 94. GENERATOR
function* generer(): Generator<number, void, unknown> {
    yield 1;
    yield 2;
    yield 3;
}


// 95. ASYNC GENERATOR
async function* genererAsync(): AsyncGenerator<string, void, unknown> {
    yield "un";
    yield "deux";
}


// 96. ITERABLE
class Collection implements Iterable<number> {
    constructor(private values: number[]) {}
    *[Symbol.iterator](): Iterator<number> {
        for (const value of this.values) yield value;
    }
}


// 97. BRANDED TYPE
type UserId = number & { readonly __brand: "UserId" };
function creerUserId(value: number): UserId {
    if (!Number.isInteger(value) || value <= 0) throw new Error("ID invalide");
    return value as UserId;
}


// 98. VALIDATION RUNTIME
function estObjet(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}


// 99. DTO
interface CreerUtilisateurDTO {
    nom: string;
    email: string;
}


// 100. DOM : NAVIGATEUR UNIQUEMENT
// Ce code ne doit pas être exécuté dans Node.js.
// const bouton = document.querySelector<HTMLButtonElement>("#valider");
// bouton?.addEventListener("click", (event: MouseEvent) => console.log(event));


// 101. NODE : PROCESS
// Node.js fournit process. Il ne s'agit pas d'une API navigateur.
console.log("Node version :", process.version);
console.log("Répertoire :", process.cwd());


// 102. MODULES
// Dans un vrai projet, séparer les déclarations dans plusieurs fichiers.
// export interface User { id: number; }
// import type { User } from "./user.js";


// 103. CONFIGURATION TS
// target : version JS cible.
// module : format des modules.
// moduleResolution : résolution des imports.
// rootDir : dossier source.
// outDir : dossier de sortie.
// strict : contrôles stricts.
// noEmit : ne génère aucun fichier.
// include : fichiers inclus.
// exclude : fichiers exclus.


// 104. DECLARE
// declare décrit une valeur fournie par l'environnement.
// declare const VERSION: string;


// 105. FICHIER .D.TS
// Un fichier .d.ts décrit les types d'un module sans implémentation.
// export declare function calculer(a: number, b: number): number;


// 106. NPM / NPX / TSC / TSX
// npm install : installe les dépendances.
// npx tsc --noEmit : vérifie les types.
// npx tsc : compile selon tsconfig.
// npx tsx src/index.ts : exécute le TypeScript en développement.
// node dist/index.js : exécute le JavaScript compilé.


// 107. ARCHITECTURE : CONTRAT
interface UtilisateurRepository {
    trouver(id: number): Promise<Utilisateur | null>;
}


// 108. ARCHITECTURE : INFRASTRUCTURE
class UtilisateurRepositoryMemoire implements UtilisateurRepository {
    private data: Utilisateur[] = [utilisateur];
    async trouver(id: number): Promise<Utilisateur | null> {
        return this.data.find(user => user.id === id) ?? null;
    }
}


// 109. ARCHITECTURE : SERVICE
class ObtenirUtilisateur {
    constructor(private repository: UtilisateurRepository) {}
    executer(id: number): Promise<Utilisateur | null> {
        return this.repository.trouver(id);
    }
}


// 110. INJECTION DE DÉPENDANCES
const repository = new UtilisateurRepositoryMemoire();
const useCase = new ObtenirUtilisateur(repository);
void useCase.executer(1);


// 111. SOLID
// S : Single Responsibility.
// O : Open/Closed.
// L : Liskov Substitution.
// I : Interface Segregation.
// D : Dependency Inversion.


// 112. STRATEGY
interface Strategie {
    executer(value: number): number;
}
class StrategieDouble implements Strategie {
    executer(value: number): number { return value * 2; }
}
class Contexte {
    constructor(private strategie: Strategie) {}
    run(value: number): number { return this.strategie.executer(value); }
}


// 113. ADAPTER
interface Notification {
    envoyer(message: string): void;
}
class AncienSMS {
    envoyerSMS(message: string): void { console.log(message); }
}
class SMSAdapter implements Notification {
    constructor(private ancien: AncienSMS) {}
    envoyer(message: string): void { this.ancien.envoyerSMS(message); }
}


// 114. FACTORY
interface Exporteur {
    exporter(): string;
}
class ExporteurCSV implements Exporteur {
    exporter(): string { return "CSV"; }
}
class ExporteurFactory {
    static creer(): Exporteur { return new ExporteurCSV(); }
}


// 115. OBSERVER
type Observateur<T> = (value: T) => void;
class Sujet<T> {
    private observers: Observateur<T>[] = [];
    subscribe(observer: Observateur<T>): void { this.observers.push(observer); }
    notify(value: T): void { this.observers.forEach(observer => observer(value)); }
}


// 116. TEST MANUEL
function assertEqual<T>(actual: T, expected: T): void {
    if (actual !== expected) throw new Error("Test échoué");
}
assertEqual(addition(2, 3), 5);


// 117. EXEMPLE MÉTIER : SALLE
type TypeSalle = "cours" | "informatique" | "laboratoire";
interface Salle {
    id: number;
    nom: string;
    capacite: number;
    type: TypeSalle;
    active: boolean;
}
function salleDisponible(salle: Salle): boolean {
    return salle.active && salle.capacite > 0;
}


// 118. EXEMPLE MÉTIER : RÉSERVATION
type StatutReservation = "en_attente" | "confirmee" | "annulee";
interface Reservation {
    id: number;
    salleId: number;
    dateDebut: Date;
    dateFin: Date;
    statut: StatutReservation;
}


// 119. EXEMPLE DE VALIDATION DATE
function validerPeriode(debut: Date, fin: Date): boolean {
    return !Number.isNaN(debut.getTime()) &&
        !Number.isNaN(fin.getTime()) &&
        fin > debut;
}


// 120. FIN
console.log("Fin du support TypeScript");

/*
================================================================================
                         NOTES DÉTAILLÉES PAR CONCEPT
================================================================================
*/

/* ==================== TYPES PRIMITIFS ==================== */

// string représente les chaînes de caractères.

// number représente les nombres JavaScript, entiers ou décimaux.

// boolean représente true ou false.

// bigint représente les grands entiers.

// symbol représente une valeur unique.

// null représente une absence intentionnelle.

// undefined représente une valeur non définie.

// Les annotations sont effacées lors de la transformation vers JavaScript.

// typeof permet d'inspecter un type primitif à l'exécution.

// L'inférence évite de répéter les annotations évidentes.

/* ==================== ANY ET UNKNOWN ==================== */

// any désactive une grande partie du contrôle statique.

// unknown accepte toutes les valeurs mais ne permet pas de les utiliser sans vérification.

// Préférer unknown pour les données venant d'une source externe.

// Vérifier avec typeof pour les primitives.

// Vérifier avec instanceof pour les instances de classes.

// Vérifier avec in pour la présence d'une propriété.

// Un type guard peut formaliser une vérification réutilisable.

// Ne pas utiliser any pour faire taire le compilateur sans comprendre l'erreur.

/* ==================== VOID ET NEVER ==================== */

// void est principalement utilisé pour le retour d'une fonction sans résultat utile.

// never représente une valeur qui ne peut pas se produire.

// Une fonction qui lance toujours une exception peut retourner never.

// Une fonction qui boucle sans fin peut retourner never.

// never est utile pour vérifier l'exhaustivité d'un switch.

// Une union réduite jusqu'à aucun cas restant devient never.

// undefined et void ne sont pas interchangeables dans tous les contextes.

/* ==================== TABLEAUX ET TUPLES ==================== */

// Un tableau T[] contient des éléments de type T.

// Array<T> est une syntaxe générique équivalente à T[].

// readonly T[] empêche la modification à travers cette référence.

// Un tuple fixe le type de chaque position.

// Un tuple peut contenir des éléments optionnels.

// Un tuple peut utiliser un élément rest.

// map transforme chaque élément et produit un nouveau tableau.

// filter conserve les éléments qui satisfont une condition.

// reduce accumule les éléments dans une valeur.

// find retourne un élément ou undefined.

// some vérifie si au moins un élément satisfait le prédicat.

// every vérifie si tous les éléments satisfont le prédicat.

/* ==================== UNION ET INTERSECTION ==================== */

// Une union A | B accepte A ou B.

// Une intersection A & B impose les propriétés de A et de B.

// Une union demande souvent un narrowing avant l'utilisation.

// Une intersection peut composer plusieurs contrats.

// Les unions littérales limitent les valeurs autorisées.

// Les unions discriminées utilisent une propriété commune littérale.

// Les unions discriminées facilitent les switch exhaustifs.

// Éviter les unions trop larges qui rendent les cas difficiles à distinguer.

/* ==================== TYPE ET INTERFACE ==================== */

// type crée un alias de type.

// interface décrit principalement un contrat de structure.

// Une interface peut étendre une autre interface.

// Une classe peut implémenter plusieurs interfaces.

// Les interfaces peuvent être fusionnées par déclaration.

// Les alias peuvent représenter des unions et intersections.

// Les deux peuvent décrire des objets.

// Choisir une convention stable dans un projet.

// Une interface ne crée pas de classe à l'exécution.

// Une interface n'effectue aucune validation de données.

/* ==================== FONCTIONS ==================== */

// Les paramètres peuvent être annotés.

// Le type de retour peut être annoté.

// TypeScript peut inférer le type de retour.

// Un paramètre optionnel se note avec ?.

// Un paramètre par défaut possède une valeur de repli.

// Les paramètres rest regroupent plusieurs arguments.

// Une fonction fléchée capture le this lexical.

// Une callback est une fonction passée à une autre fonction.

// Une surcharge propose plusieurs signatures publiques.

// Une seule implémentation réalise la surcharge.

// Une fonction peut retourner une autre fonction.

// Une fonction peut recevoir une fonction en paramètre.

// Les types de fonction peuvent être décrits avec type ou interface.

/* ==================== NARROWING ET ASSERTIONS ==================== */

// Le narrowing réduit les types possibles dans une branche.

// typeof est utile pour string, number, boolean, bigint, symbol et undefined.

// instanceof est utile pour les classes.

// in vérifie la présence d'une propriété.

// Les égalités de littéraux réduisent une union.

// Une fonction predicate utilise la syntaxe value is Type.

// Une assertion as ne transforme pas la valeur.

// La non-null assertion ! ne fait pas de vérification runtime.

// Une assertion abusive peut cacher un bug.

// Les données externes doivent être validées à l'exécution.

/* ==================== GENERICS ==================== */

// Un generic est un paramètre de type.

// Il permet de réutiliser une fonction sans perdre l'information de type.

// T est une convention fréquente pour le premier paramètre générique.

// K est souvent utilisé pour une clé.

// V est souvent utilisé pour une valeur.

// Les contraintes utilisent extends.

// Un paramètre générique peut avoir une valeur par défaut.

// Une fonction générique peut avoir plusieurs paramètres.

// Une interface peut être générique.

// Une classe peut être générique.

// Un generic n'est pas any.

// Le generic conserve la relation entre entrée et sortie.

/* ==================== UTILITY TYPES ==================== */

// Partial rend toutes les propriétés facultatives.

// Required rend toutes les propriétés obligatoires.

// Readonly rend les propriétés readonly.

// Pick sélectionne des propriétés.

// Omit retire des propriétés.

// Record construit un type d'objet indexé.

// Exclude retire des membres d'une union.

// Extract conserve les membres compatibles.

// NonNullable retire null et undefined.

// ReturnType récupère le type de retour d'une fonction.

// Parameters récupère les types de paramètres.

// Awaited récupère le type résolu d'une Promise.

// InstanceType récupère le type d'instance d'un constructeur.

// ConstructorParameters récupère les paramètres du constructeur.

/* ==================== TYPES AVANCÉS ==================== */

// keyof récupère les clés d'un type.

// typeof en position de type récupère le type d'une valeur.

// T[K] récupère le type d'une propriété.

// Un mapped type parcourt les clés d'un type.

// Un conditional type choisit un type selon une condition.

// infer capture un type dans un conditional type.

// Un template literal type construit des chaînes de types.

// as const conserve les valeurs littérales.

// satisfies vérifie la compatibilité sans élargir inutilement le type.

// Un branded type distingue deux valeurs ayant le même type runtime.

// Un type récursif peut représenter JSON ou un arbre.

// Une signature d'index décrit les clés dynamiques.

/* ==================== POO ==================== */

// Une classe JavaScript est une syntaxe basée sur les prototypes.

// Une instance est créée avec new.

// Le constructeur initialise l'instance.

// Une méthode décrit un comportement.

// public est le niveau d'accès par défaut.

// private TypeScript est contrôlé statiquement.

// #private JavaScript protège un champ à l'exécution.

// protected autorise l'accès dans la classe et les sous-classes.

// readonly interdit la réaffectation au niveau du typage.

// static appartient à la classe.

// extends exprime l'héritage.

// super appelle le constructeur ou une méthode parent.

// override signale une redéfinition.

// abstract interdit l'instanciation directe de la classe abstraite.

// implements impose un contrat d'interface.

// Le polymorphisme permet plusieurs implémentations d'un contrat.

// La composition assemble des objets collaborateurs.

// Les getters et setters contrôlent l'accès aux propriétés.

// Les parameter properties raccourcissent le constructeur TypeScript.

/* ==================== DÉCORATEURS ==================== */

// Un décorateur est une fonction appliquée à une déclaration.

// Les décorateurs modernes utilisent une valeur et un contexte.

// Un décorateur de méthode peut envelopper la méthode.

// Un décorateur de classe reçoit le constructeur.

// Un décorateur de champ peut transformer son initialiseur.

// Un décorateur d'accesseur peut remplacer get, set ou init.

// Les décorateurs modernes diffèrent des décorateurs legacy.

// experimentalDecorators concerne l'ancien modèle.

// Un décorateur ne valide pas automatiquement les données entrantes.

// Un décorateur ne remplace pas l'injection de dépendances.

// Les métadonnées runtime demandent une stratégie explicite.

/* ==================== JAVASCRIPT NATIF ==================== */

// String fournit les méthodes de manipulation de texte.

// Number fournit les conversions et vérifications numériques.

// Math fournit les fonctions mathématiques.

// Array fournit map, filter, reduce, find, some et every.

// Object fournit keys, values, entries, assign et freeze.

// Map stocke des associations clé-valeur.

// Set stocke des valeurs uniques.

// Date représente une date et un instant.

// JSON stringify convertit une valeur en chaîne JSON.

// JSON parse transforme une chaîne en valeur non validée.

// Promise représente un résultat asynchrone.

// async déclare une fonction qui retourne une Promise.

// await attend une Promise dans un contexte async.

// Symbol définit des identifiants uniques.

// Les generators produisent des valeurs à la demande.

// Les iterables exposent un protocole d'itération.

/* ==================== NODE ET NAVIGATEUR ==================== */

// Node.js est un runtime JavaScript hors navigateur.

// Le navigateur fournit window, document et le DOM.

// Node.js fournit process, fs, path, http et d'autres modules.

// HTMLElement appartient aux types DOM.

// Buffer appartient à l'environnement Node.js.

// Le code DOM ne s'exécute pas directement dans Node sans environnement DOM.

// Les types de Node sont généralement fournis par @types/node.

// Les types DOM sont inclus selon la configuration TypeScript.

// Ne pas mélanger les dépendances serveur et navigateur sans raison.

/* ==================== ARCHITECTURE ==================== */

// Un DTO représente les données échangées entre couches.

// Un repository abstrait l'accès aux données.

// Un service porte une opération applicative ou métier.

// Un contrat définit les comportements attendus.

// L'injection par constructeur rend les dépendances visibles.

// Le principe SRP sépare les responsabilités.

// Le principe OCP favorise l'extension sans modification répétée.

// Le principe LSP concerne la substituabilité.

// Le principe ISP évite les interfaces trop larges.

// Le principe DIP fait dépendre les modules d'abstractions.

// Strategy rend un algorithme interchangeable.

// Adapter traduit une interface vers une autre.

// Factory centralise la création.

// Observer notifie des abonnés.

// Une architecture en couches sépare présentation, application, domaine et infrastructure.

/* ==================== COMPILATION ET OUTILS ==================== */

// npm gère les packages et les scripts.

// npx exécute un binaire de package.

// tsc vérifie et compile TypeScript.

// tsx exécute les fichiers TypeScript en développement.

// tsconfig.json configure le compilateur.

// noEmit empêche la génération de fichiers.

// outDir indique le dossier de sortie lorsque l'émission est activée.

// rootDir indique la racine des fichiers source.

// include définit les fichiers inclus.

// exclude exclut certains fichiers de la découverte initiale.

// strict active un ensemble de vérifications strictes.

// sourceMap génère une correspondance entre code source et code généré.

// declaration génère des fichiers de déclaration si l'émission est activée.

// Les fichiers .d.ts décrivent des types sans implémentation.

/*
================================================================================
                         100 EXERCICES DE RÉVISION
================================================================================
*/

// Exercice 001 : Créer une variable string et observer l'inférence.

// Exercice 002 : Créer une variable number et tenter de lui affecter une chaîne.

// Exercice 003 : Créer un tableau de nombres et utiliser map.

// Exercice 004 : Créer un tableau mixte avec une union.

// Exercice 005 : Créer un tuple utilisateur avec id, nom et actif.

// Exercice 006 : Créer un type littéral pour les rôles d'une application.

// Exercice 007 : Créer une interface Produit avec id, nom et prix.

// Exercice 008 : Créer une interface Admin qui étend Utilisateur.

// Exercice 009 : Créer un type combinant Adresse et Contact.

// Exercice 010 : Créer une fonction addition avec paramètres typés.

// Exercice 011 : Créer une fonction sans retour et annoter void.

// Exercice 012 : Créer une fonction qui retourne never.

// Exercice 013 : Créer une fonction avec un paramètre optionnel.

// Exercice 014 : Créer une fonction avec une valeur par défaut.

// Exercice 015 : Créer une fonction qui accepte un callback.

// Exercice 016 : Créer un alias de fonction pour un comparateur.

// Exercice 017 : Créer deux signatures de surcharge pour convertir.

// Exercice 018 : Créer un type guard pour une chaîne.

// Exercice 019 : Créer un type guard pour un objet utilisateur.

// Exercice 020 : Créer une assertion function pour un nombre.

// Exercice 021 : Utiliser keyof pour obtenir les clés d'un objet.

// Exercice 022 : Utiliser typeof pour créer un type depuis une constante.

// Exercice 023 : Utiliser indexed access pour obtenir le type d'une propriété.

// Exercice 024 : Créer une fonction générique identité.

// Exercice 025 : Créer une fonction générique qui retourne le premier élément.

// Exercice 026 : Créer une contrainte générique basée sur length.

// Exercice 027 : Créer une interface générique Repository.

// Exercice 028 : Créer une classe générique Boite.

// Exercice 029 : Appliquer Partial à un type.

// Exercice 030 : Appliquer Required à un type.

// Exercice 031 : Appliquer Readonly à un type.

// Exercice 032 : Appliquer Pick à un type.

// Exercice 033 : Appliquer Omit à un type.

// Exercice 034 : Créer un Record pour stocker des prix.

// Exercice 035 : Utiliser Exclude sur une union.

// Exercice 036 : Utiliser Extract sur une union.

// Exercice 037 : Utiliser NonNullable sur une union.

// Exercice 038 : Utiliser ReturnType sur une fonction.

// Exercice 039 : Utiliser Parameters sur une fonction.

// Exercice 040 : Utiliser Awaited sur une Promise.

// Exercice 041 : Créer un mapped type readonly.

// Exercice 042 : Créer un mapped type optionnel.

// Exercice 043 : Créer un conditional type.

// Exercice 044 : Créer un template literal type.

// Exercice 045 : Créer un branded type pour UserId.

// Exercice 046 : Créer un type récursif JSON.

// Exercice 047 : Créer une classe avec constructeur.

// Exercice 048 : Créer une propriété private.

// Exercice 049 : Créer une propriété protected.

// Exercice 050 : Créer une propriété readonly.

// Exercice 051 : Créer une méthode static.

// Exercice 052 : Créer un getter.

// Exercice 053 : Créer un setter qui refuse une valeur négative.

// Exercice 054 : Créer une classe enfant avec extends.

// Exercice 055 : Redéfinir une méthode avec override.

// Exercice 056 : Créer une classe abstraite.

// Exercice 057 : Créer une classe qui implements une interface.

// Exercice 058 : Créer un exemple de polymorphisme.

// Exercice 059 : Remplacer un héritage par une composition.

// Exercice 060 : Créer une classe générique.

// Exercice 061 : Créer un décorateur moderne de méthode.

// Exercice 062 : Créer un décorateur moderne de classe.

// Exercice 063 : Créer un décorateur moderne de champ.

// Exercice 064 : Comparer décorateurs modernes et legacy.

// Exercice 065 : Utiliser String.trim et String.includes.

// Exercice 066 : Utiliser Number.isInteger et Number.isNaN.

// Exercice 067 : Utiliser Math.round et Math.max.

// Exercice 068 : Utiliser Array.map, filter et reduce.

// Exercice 069 : Utiliser Object.keys et Object.entries.

// Exercice 070 : Créer et lire une Map.

// Exercice 071 : Créer et lire un Set.

// Exercice 072 : Créer une Date et afficher ISO.

// Exercice 073 : Convertir un objet en JSON.

// Exercice 074 : Valider un JSON reçu comme unknown.

// Exercice 075 : Créer une Promise<string>.

// Exercice 076 : Créer une fonction async.

// Exercice 077 : Utiliser Promise.all.

// Exercice 078 : Utiliser Promise.allSettled.

// Exercice 079 : Traiter une erreur comme unknown.

// Exercice 080 : Créer une classe d'erreur métier.

// Exercice 081 : Créer une union discriminée pour un état API.

// Exercice 082 : Rendre un switch exhaustif avec never.

// Exercice 083 : Créer un générateur typé.

// Exercice 084 : Créer un itérateur personnalisé.

// Exercice 085 : Créer une closure qui conserve un compteur.

// Exercice 086 : Créer une fonction d'ordre supérieur.

// Exercice 087 : Créer une fonction récursive factorielle.

// Exercice 088 : Créer un DTO de création.

// Exercice 089 : Créer un repository en mémoire.

// Exercice 090 : Créer un service qui reçoit un repository par constructeur.

// Exercice 091 : Injecter une horloge dans un service.

// Exercice 092 : Créer une stratégie de paiement.

// Exercice 093 : Créer un adaptateur SMS.

// Exercice 094 : Créer une factory d'export.

// Exercice 095 : Créer un observer d'événements.

// Exercice 096 : Créer une validation d'environnement.

// Exercice 097 : Créer un test manuel avec assert.

// Exercice 098 : Exécuter le code avec tsx.

// Exercice 099 : Vérifier les types avec tsc --noEmit.

// Exercice 100 : Compiler vers dist puis exécuter avec node.

/*
================================================================================
                         GLOSSAIRE
================================================================================
*/

// 001. Annotation : précision explicite d'un type.

// 002. Inférence : déduction automatique d'un type.

// 003. Narrowing : réduction des types possibles après une vérification.

// 004. Union : type qui accepte plusieurs alternatives.

// 005. Intersection : type qui combine plusieurs contraintes.

// 006. Tuple : tableau à positions typées.

// 007. Literal : type limité à une valeur précise.

// 008. Alias : nom attribué à un type.

// 009. Interface : contrat de structure statique.

// 010. Generic : paramètre de type réutilisable.

// 011. Constraint : condition imposée à un paramètre générique.

// 012. Utility type : outil de transformation de types fourni par TypeScript.

// 013. Mapped type : type construit en parcourant les clés d'un autre type.

// 014. Conditional type : type calculé à partir d'une condition.

// 015. Predicate : signature qui indique qu'une valeur est d'un type donné.

// 016. Assertion : indication de type sans conversion runtime.

// 017. Readonly : restriction de réaffectation au niveau du typage.

// 018. Never : type représentant l'impossibilité.

// 019. Unknown : type inconnu qui impose une vérification.

// 020. Any : type qui désactive les vérifications.

// 021. Abstract : classe ou membre incomplet destiné à être spécialisé.

// 022. Polymorphisme : plusieurs implémentations derrière un contrat commun.

// 023. Composition : assemblage d'objets collaborateurs.

// 024. Encapsulation : contrôle de l'accès à l'état interne.

// 025. Décorateur : fonction appliquée à une déclaration.

// 026. Promise : représentation d'un résultat futur.

// 027. Callback : fonction transmise à une autre fonction.

// 028. Closure : fonction qui conserve son environnement lexical.

// 029. Module : fichier qui expose ou importe des éléments.

// 030. DTO : objet de transfert de données.

// 031. Repository : abstraction d'accès aux données.

// 032. Service : composant portant une opération métier ou applicative.

// 033. Injection de dépendances : fourniture de dépendances depuis l'extérieur.

// 034. SOLID : cinq principes de conception logicielle.

// 035. Strategy : patron rendant un algorithme interchangeable.

// 036. Adapter : patron qui traduit une interface.

// 037. Factory : patron qui centralise la création d'objets.

// 038. Observer : patron de notification d'abonnés.

// 039. Runtime validation : validation effectuée pendant l'exécution.

// 040. Compilation : vérification ou transformation du code source.

// 041. Declaration file : fichier .d.ts décrivant des types.

// 042. Source map : correspondance entre source et code généré.

// 043. Node.js : runtime JavaScript côté serveur et terminal.

// 044. DOM : API navigateur de manipulation de documents.

// 045. npm : gestionnaire de packages et de scripts.

// 046. npx : outil d'exécution de binaires de packages.

// 047. tsc : compilateur TypeScript.

// 048. tsx : outil d'exécution TypeScript en développement.

// 049. tsconfig : configuration du compilateur TypeScript.

/*
================================================================================
                         COMPARAISON JAVASCRIPT / TYPESCRIPT
================================================================================

CONCEPT                         JAVASCRIPT             TYPESCRIPT
let / const                     Oui                    Oui
Fonctions                       Oui                    Oui + types
Fonctions fléchées              Oui                    Oui + types
Classes                         Oui                    Oui + types
Héritage                        Oui                    Oui
Encapsulation #private          Oui                    Oui
interface                       Non                    Oui
type alias                      Non                    Oui
Union types                     Non                    Oui
Intersection types              Non                    Oui
Tuple typée                     Non                    Oui
Enum TypeScript                 Non                    Oui
Generics                        Non                    Oui
Utility Types                   Non                    Oui
Mapped Types                    Non                    Oui
Conditional Types               Non                    Oui
Type Guards                     Tests runtime          Tests + narrowing TS
Abstract class                  Non                    Oui
implements                      Non                    Oui
readonly TS                     Non                    Oui
Décorateurs                     Standard moderne       Oui
Promise                         Oui                    Oui + types
async / await                   Oui                    Oui + types
Map / Set                       Oui                    Oui + types
Date / JSON / Math              Oui                    Oui + signatures

À retenir :
- JavaScript fournit les comportements runtime.
- TypeScript ajoute un système de types statique.
- Les types sont supprimés à l'émission JavaScript.
- Une validation runtime reste nécessaire pour les données externes.
*/