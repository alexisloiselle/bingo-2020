import cellsLoiselle from "./cells.loiselle";
import cellsMtlo from "./cells.mtlo";

const cells = [
  { id: 1, value: "On t'entend pas t'es sur mute" },
  { id: 2, value: "Nouvelle souche plus contagieuse" },
  { id: 3, value: "Colis pogné à Mississauga" },
  { id: 4, value: "Un bébé tenu comme Simba devant la webcam" },
  { id: 5, value: "Séchesseldé" },
  { id: 6, value: "Une infirmière que je connais dit que" },
  { id: 7, value: "Le masque sous le nez" },
  { id: 8, value: "Devinez qui est parti dans le sud" },
  { id: 9, value: "Anecdote d'épicerie" },
  { id: 10, value: "Ado hors-champ se fait dire de venir dire allô" },
  { id: 11, value: "Systémique pas systématique" },
  { id: 12, value: "Untel l'a eue pis c'était pas si pire que ça" },
  { id: 13, value: "Apparation d'un anus de chat" },
  { id: 14, value: "Mauvaise joke sur la 5G" },
  { id: 15, value: "Connexion de chalet" },
  { id: 16, value: "Conversation malaisante sur le complotiste de la famille" },
  { id: 17, value: "Changer de background pour faire une joke de voyage" },
  { id: 18, value: "Prononcer le P dans Pfizer" },
  { id: 19, value: "Potin de voisinage délinquant" },
  { id: 20, value: "Pendant ce temps-là, Costco pis Wal-Mart" },
  { id: 21, value: "Compter jusqu'à 3 avant un screenshot" },
  { id: 22, value: "Les cotes d'écoute du Bye bye c't'année" },
  { id: 23, value: "Je reviens, je vais aux toilettes" },
  { id: 24, value: "Ça va fêter fort en 2021" },
];

export default (key?: string): { id: number; value: string }[] => {
  if (!key) return cells;

  const map: { [key: string]: { id: number; value: string }[] } = {
    loiselle: cellsLoiselle,
    mtlo: cellsMtlo,
  };

  return map[key] ?? cells;
};
