const db = [
  { nome: "Gocciole Chocolate (Pavesi)", kcal: 486, grassi: 22.0, saturi: 6.2, carboidrati: 62.2, zuccheri: 24.0, fibre: 4.4, proteine: 7.5, sale: 0.53 },
  { nome: "Pan di Stelle (Mulino Bianco)", kcal: 483, grassi: 20.5, saturi: 7.8, carboidrati: 65.0, zuccheri: 23.5, fibre: 4.0, proteine: 7.5, sale: 0.48 },
  { nome: "Macine (Mulino Bianco)", kcal: 482, grassi: 20.0, saturi: 3.3, carboidrati: 68.0, zuccheri: 19.0, fibre: 2.8, proteine: 6.0, sale: 0.83 },
  { nome: "Oro Saiwa (Saiwa)", kcal: 417, grassi: 8.3, saturi: 0.8, carboidrati: 76.0, zuccheri: 20.0, fibre: 3.4, proteine: 8.3, sale: 0.62 },
  { nome: "GranTurchese (Colussi)", kcal: 454, grassi: 14.0, saturi: 1.6, carboidrati: 72.0, zuccheri: 26.0, fibre: 2.4, proteine: 8.7, sale: 0.63 },
  { nome: "Galletti (Mulino Bianco)", kcal: 474, grassi: 18.2, saturi: 1.9, carboidrati: 68.5, zuccheri: 19.5, fibre: 3.0, proteine: 7.5, sale: 0.73 },
  { nome: "Tarallucci (Mulino Bianco)", kcal: 471, grassi: 18.5, saturi: 2.0, carboidrati: 67.5, zuccheri: 20.5, fibre: 3.0, proteine: 7.0, sale: 0.68 },
  { nome: "Bucaneve (Doria)", kcal: 465, grassi: 16.5, saturi: 8.3, carboidrati: 70.7, zuccheri: 23.5, fibre: 2.5, proteine: 7.1, sale: 0.65 },
  { nome: "Abbracci (Mulino Bianco)", kcal: 485, grassi: 21.5, saturi: 10.2, carboidrati: 63.5, zuccheri: 24.0, fibre: 3.3, proteine: 7.2, sale: 0.63 },
  { nome: "Campagnole (Mulino Bianco)", kcal: 468, grassi: 17.5, saturi: 3.0, carboidrati: 68.5, zuccheri: 19.5, fibre: 3.5, proteine: 7.3, sale: 0.78 },
  { nome: "Ringo Vaniglia (Pavesi)", kcal: 486, grassi: 21.0, saturi: 9.5, carboidrati: 67.0, zuccheri: 31.0, fibre: 2.5, proteine: 6.0, sale: 0.45 },
  { nome: "Baiocchi (Mulino Bianco)", kcal: 511, grassi: 26.0, saturi: 10.5, carboidrati: 59.5, zuccheri: 25.0, fibre: 3.5, proteine: 7.5, sale: 0.45 },
  { nome: "Krumiri (Bistefani)", kcal: 475, grassi: 19.0, saturi: 10.0, carboidrati: 68.0, zuccheri: 24.0, fibre: 2.0, proteine: 7.0, sale: 0.55 },
  { nome: "Batticuori (Mulino Bianco)", kcal: 472, grassi: 19.0, saturi: 8.8, carboidrati: 65.7, zuccheri: 23.5, fibre: 4.5, proteine: 7.3, sale: 0.50 },
  { nome: "Rigoli (Mulino Bianco)", kcal: 463, grassi: 16.0, saturi: 1.5, carboidrati: 70.5, zuccheri: 21.5, fibre: 3.0, proteine: 7.5, sale: 0.70 },
  { nome: "Nascondini (Mulino Bianco)", kcal: 480, grassi: 21.0, saturi: 10.0, carboidrati: 63.4, zuccheri: 24.0, fibre: 3.3, proteine: 7.6, sale: 0.48 },
  { nome: "Molinetto (Mulino Bianco)", kcal: 482, grassi: 20.5, saturi: 5.5, carboidrati: 65.0, zuccheri: 22.0, fibre: 3.5, proteine: 7.5, sale: 0.75 },
  { nome: "Spicchi di Sole (Mulino Bianco)", kcal: 472, grassi: 18.5, saturi: 1.9, carboidrati: 68.0, zuccheri: 19.5, fibre: 3.5, proteine: 7.0, sale: 0.73 },
  { nome: "Pannocchie (Mulino Bianco)", kcal: 471, grassi: 18.5, saturi: 1.9, carboidrati: 67.5, zuccheri: 20.5, fibre: 4.0, proteine: 6.5, sale: 0.78 },
  { nome: "Buongrano (Mulino Bianco)", kcal: 464, grassi: 18.5, saturi: 1.9, carboidrati: 63.5, zuccheri: 21.0, fibre: 6.5, proteine: 7.5, sale: 0.70 },
  { nome: "Cuor di Mela (Mulino Bianco)", kcal: 427, grassi: 15.0, saturi: 7.3, carboidrati: 66.2, zuccheri: 31.5, fibre: 2.8, proteine: 5.5, sale: 0.33 },
  { nome: "Primizie (Mulino Bianco)", kcal: 470, grassi: 18.5, saturi: 1.9, carboidrati: 67.2, zuccheri: 19.5, fibre: 4.0, proteine: 6.8, sale: 0.75 },
  { nome: "Ritornelli (Mulino Bianco)", kcal: 479, grassi: 20.0, saturi: 5.3, carboidrati: 66.0, zuccheri: 25.0, fibre: 3.3, proteine: 7.0, sale: 0.53 },
  { nome: "Scacchieri (Mulino Bianco)", kcal: 485, grassi: 22.0, saturi: 9.8, carboidrati: 62.5, zuccheri: 23.0, fibre: 3.5, proteine: 7.5, sale: 0.45 },
  { nome: "Osvego (Gentilini)", kcal: 450, grassi: 13.8, saturi: 8.5, carboidrati: 71.5, zuccheri: 22.0, fibre: 3.0, proteine: 8.5, sale: 0.65 },
  { nome: "Novellini (Gentilini)", kcal: 465, grassi: 16.5, saturi: 11.0, carboidrati: 70.0, zuccheri: 25.5, fibre: 2.0, proteine: 8.0, sale: 0.55 },
  { nome: "Marie (Saiwa)", kcal: 435, grassi: 11.0, saturi: 1.2, carboidrati: 74.0, zuccheri: 21.0, fibre: 3.0, proteine: 8.5, sale: 0.85 },
  { nome: "Nocciolini (Lazzaroni)", kcal: 460, grassi: 17.0, saturi: 2.0, carboidrati: 69.0, zuccheri: 30.0, fibre: 2.5, proteine: 6.5, sale: 0.60 },
  { nome: "Oswego (Colussi)", kcal: 440, grassi: 12.0, saturi: 1.3, carboidrati: 73.0, zuccheri: 21.0, fibre: 3.0, proteine: 8.5, sale: 0.70 },
  { nome: "Zuppalatte (Colussi)", kcal: 436, grassi: 10.0, saturi: 1.1, carboidrati: 77.0, zuccheri: 22.0, fibre: 2.5, proteine: 8.0, sale: 0.85 },
  { nome: "Frollini Gocce Cioccolato (Esselunga)", kcal: 480, grassi: 21.0, saturi: 10.5, carboidrati: 64.0, zuccheri: 24.0, fibre: 3.5, proteine: 6.8, sale: 0.55 },
  { nome: "Biscotti della Salute (Monviso)", kcal: 405, grassi: 6.5, saturi: 0.8, carboidrati: 74.0, zuccheri: 15.0, fibre: 6.0, proteine: 10.0, sale: 0.40 },
  { nome: "Grancereale Classico (Mulino Bianco)", kcal: 466, grassi: 19.0, saturi: 2.0, carboidrati: 61.5, zuccheri: 17.5, fibre: 10.0, proteine: 8.0, sale: 0.75 },
  { nome: "Grancereale Croccante (Mulino Bianco)", kcal: 474, grassi: 20.5, saturi: 2.2, carboidrati: 61.0, zuccheri: 19.0, fibre: 9.0, proteine: 7.0, sale: 0.65 },
  { nome: "Grancereale Cioccolato (Mulino Bianco)", kcal: 477, grassi: 21.0, saturi: 4.5, carboidrati: 60.0, zuccheri: 21.0, fibre: 9.5, proteine: 7.5, sale: 0.70 },
  { nome: "Grancereale Frutta (Mulino Bianco)", kcal: 457, grassi: 17.5, saturi: 1.8, carboidrati: 64.0, zuccheri: 23.0, fibre: 8.5, proteine: 6.5, sale: 0.65 },
  { nome: "Privolat Gocce Cioccolato (Misura)", kcal: 458, grassi: 17.0, saturi: 4.6, carboidrati: 67.0, zuccheri: 22.0, fibre: 4.5, proteine: 7.0, sale: 0.55 },
  { nome: "Fibrextra Integrale (Misura)", kcal: 434, grassi: 15.0, saturi: 1.5, carboidrati: 60.0, zuccheri: 18.0, fibre: 14.0, proteine: 8.0, sale: 0.75 },
  { nome: "Dolcesenza Senza Zuccheri (Misura)", kcal: 433, grassi: 15.0, saturi: 1.6, carboidrati: 70.0, zuccheri: 1.0, fibre: 5.5, proteine: 8.5, sale: 0.80 },
  { nome: "Multigrain (Kellogg's)", kcal: 446, grassi: 15.0, saturi: 1.8, carboidrati: 66.0, zuccheri: 19.0, fibre: 7.5, proteine: 8.0, sale: 0.55 },
  { nome: "Pavesini Classici (Pavesi)", kcal: 392, grassi: 3.5, saturi: 1.1, carboidrati: 81.3, zuccheri: 48.0, fibre: 2.3, proteine: 7.8, sale: 0.50 },
  { nome: "Magretti (Galbusera)", kcal: 416, grassi: 9.5, saturi: 1.0, carboidrati: 72.0, zuccheri: 21.5, fibre: 4.0, proteine: 8.5, sale: 0.75 },
  { nome: "Turchese Più Integrale (Colussi)", kcal: 445, grassi: 14.5, saturi: 1.5, carboidrati: 65.0, zuccheri: 20.0, fibre: 9.0, proteine: 9.0, sale: 0.60 },
  { nome: "Oreo Original (Nabisco)", kcal: 474, grassi: 19.0, saturi: 5.2, carboidrati: 68.0, zuccheri: 38.0, fibre: 2.7, proteine: 5.4, sale: 0.74 },
  { nome: "Oreo Golden (Nabisco)", kcal: 482, grassi: 20.0, saturi: 5.5, carboidrati: 69.0, zuccheri: 36.0, fibre: 1.2, proteine: 4.8, sale: 0.55 },
  { nome: "Loacker Wafer Napolitaner", kcal: 511, grassi: 25.0, saturi: 21.0, carboidrati: 61.0, zuccheri: 30.0, fibre: 3.5, proteine: 8.0, sale: 0.35 },
  { nome: "Nutella Biscuits (Ferrero)", kcal: 513, grassi: 24.5, saturi: 11.8, carboidrati: 63.3, zuccheri: 34.7, fibre: 3.4, proteine: 6.3, sale: 0.53 },
  { nome: "Kinder Cards (Ferrero)", kcal: 510, grassi: 25.8, saturi: 15.2, carboidrati: 55.5, zuccheri: 38.0, fibre: 1.5, proteine: 12.8, sale: 0.42 },
  { nome: "Mikado Latte (Mondelez)", kcal: 481, grassi: 19.0, saturi: 11.0, carboidrati: 68.0, zuccheri: 35.0, fibre: 3.1, proteine: 7.3, sale: 0.70 },
  { nome: "Lotus Biscoff (Lotus)", kcal: 484, grassi: 19.0, saturi: 8.0, carboidrati: 72.6, zuccheri: 38.1, fibre: 1.3, proteine: 4.9, sale: 0.92 },
  { nome: "Grisbì Cioccolato (Vicenzi)", kcal: 534, grassi: 31.0, saturi: 13.0, carboidrati: 56.0, zuccheri: 30.0, fibre: 3.5, proteine: 6.0, sale: 0.45 },
  { nome: "Grisbì Nocciola (Vicenzi)", kcal: 540, grassi: 32.0, saturi: 14.0, carboidrati: 55.0, zuccheri: 28.0, fibre: 2.5, proteine: 6.5, sale: 0.40 },
  { nome: "Krumiri con Gocce (Bistefani)", kcal: 485, grassi: 21.0, saturi: 11.5, carboidrati: 66.0, zuccheri: 26.0, fibre: 2.5, proteine: 6.8, sale: 0.50 },
  { nome: "Togo Latte (Pavesi)", kcal: 508, grassi: 24.5, saturi: 14.5, carboidrati: 64.5, zuccheri: 35.5, fibre: 2.5, proteine: 6.0, sale: 0.45 },
  { nome: "Wafer Classic Cacao (Loacker)", kcal: 513, grassi: 25.0, saturi: 21.0, carboidrati: 60.0, zuccheri: 26.0, fibre: 4.5, proteine: 8.5, sale: 0.38 },
  { nome: "Biscotti Digestive (McVitie's)", kcal: 483, grassi: 21.3, saturi: 10.1, carboidrati: 62.8, zuccheri: 15.1, fibre: 3.8, proteine: 6.9, sale: 1.30 },
  { nome: "Digestive ai Frutti Rossi (McVitie's)", kcal: 472, grassi: 19.5, saturi: 9.2, carboidrati: 65.0, zuccheri: 20.5, fibre: 4.5, proteine: 6.5, sale: 1.10 },
  { nome: "Digestive al Cioccolato al Latte", kcal: 493, grassi: 23.6, saturi: 12.3, carboidrati: 61.7, zuccheri: 28.5, fibre: 3.0, proteine: 6.7, sale: 0.94 },
  { nome: "Plasmon (Biscotto bambini)", kcal: 412, grassi: 8.0, saturi: 3.5, carboidrati: 75.0, zuccheri: 23.0, fibre: 2.5, proteine: 8.8, sale: 0.50 },
  { nome: "Mellin (Biscotto primi mesi)", kcal: 410, grassi: 8.2, saturi: 3.7, carboidrati: 74.5, zuccheri: 22.5, fibre: 2.0, proteine: 9.0, sale: 0.45 },
  { nome: "Humana (Biscotto biologico)", kcal: 415, grassi: 8.5, saturi: 4.0, carboidrati: 73.0, zuccheri: 21.0, fibre: 2.2, proteine: 9.5, sale: 0.40 },
  { nome: "Biscotto Coop (Crescendo)", kcal: 408, grassi: 7.5, saturi: 3.2, carboidrati: 76.0, zuccheri: 24.0, fibre: 2.0, proteine: 8.5, sale: 0.55 },
  { nome: "Ami di Pane (Pavesi)", kcal: 425, grassi: 9.0, saturi: 1.2, carboidrati: 78.0, zuccheri: 22.0, fibre: 3.0, proteine: 7.5, sale: 0.80 },
  { nome: "Pavesini al Cacao (Pavesi)", kcal: 388, grassi: 3.8, saturi: 1.3, carboidrati: 79.0, zuccheri: 45.0, fibre: 3.5, proteine: 8.0, sale: 0.48 },
  { nome: "Magretti Gocce Cioccolato (Galbusera)", kcal: 428, grassi: 11.0, saturi: 2.5, carboidrati: 70.0, zuccheri: 23.0, fibre: 5.0, proteine: 9.0, sale: 0.70 },
  { nome: "Cantuccini alla Mandorla (Sapori)", kcal: 450, grassi: 15.0, saturi: 3.0, carboidrati: 68.0, zuccheri: 35.0, fibre: 4.5, proteine: 9.0, sale: 0.15 },
  { nome: "Amaretti di Saronno (Lazzaroni)", kcal: 433, grassi: 10.5, saturi: 1.0, carboidrati: 77.0, zuccheri: 75.0, fibre: 3.0, proteine: 6.5, sale: 0.10 },
  { nome: "Savoiardi (Vicenzi)", kcal: 378, grassi: 3.8, saturi: 1.1, carboidrati: 76.5, zuccheri: 42.0, fibre: 2.0, proteine: 8.5, sale: 0.22 },
  { nome: "Lingue di Gatto (Vicenzi)", kcal: 460, grassi: 15.0, saturi: 9.0, carboidrati: 72.0, zuccheri: 38.0, fibre: 1.5, proteine: 8.5, sale: 0.35 },
  { nome: "Ricciarelli di Siena (Sapori)", kcal: 445, grassi: 22.0, saturi: 2.0, carboidrati: 50.0, zuccheri: 48.0, fibre: 6.0, proteine: 9.5, sale: 0.05 },
  { nome: "Canestrelli (Vicenzi)", kcal: 520, grassi: 28.0, saturi: 18.0, carboidrati: 60.0, zuccheri: 22.0, fibre: 2.0, proteine: 6.5, sale: 0.30 },
  { nome: "Baci di Dama (Artigianali)", kcal: 550, grassi: 35.0, saturi: 15.0, carboidrati: 52.0, zuccheri: 28.0, fibre: 3.0, proteine: 7.5, sale: 0.10 },
  { nome: "Torcetti al Burro (Monviso)", kcal: 495, grassi: 22.0, saturi: 14.0, carboidrati: 68.0, zuccheri: 25.0, fibre: 2.0, proteine: 6.5, sale: 0.45 },
  { nome: "Colussi Senza Zuccheri Aggiunti", kcal: 430, grassi: 14.0, saturi: 1.5, carboidrati: 70.0, zuccheri: 0.5, fibre: 6.0, proteine: 9.5, sale: 0.75 },
  { nome: "Misura Fibrextra Miele", kcal: 438, grassi: 15.5, saturi: 1.6, carboidrati: 61.0, zuccheri: 19.0, fibre: 13.0, proteine: 8.2, sale: 0.72 },
  { nome: "Galbusera BuoniCosì (Senza Zucchero)", kcal: 435, grassi: 16.0, saturi: 1.8, carboidrati: 68.0, zuccheri: 1.0, fibre: 6.5, proteine: 8.0, sale: 0.85 },
  { nome: "Galbusera RisosuRiso", kcal: 455, grassi: 15.0, saturi: 1.7, carboidrati: 70.0, zuccheri: 20.0, fibre: 4.5, proteine: 8.5, sale: 0.80 },
  { nome: "Zerograno Frollini (Galbusera)", kcal: 465, grassi: 18.0, saturi: 8.5, carboidrati: 70.0, zuccheri: 20.0, fibre: 3.0, proteine: 4.5, sale: 0.60 },
  { nome: "BioSottile (Probios)", kcal: 410, grassi: 9.5, saturi: 1.2, carboidrati: 72.0, zuccheri: 18.0, fibre: 5.5, proteine: 8.5, sale: 0.50 },
  { nome: "Sfornatini Integrali (Mulino Bianco)", kcal: 440, grassi: 15.0, saturi: 1.6, carboidrati: 63.0, zuccheri: 18.5, fibre: 10.0, proteine: 8.5, sale: 0.95 },
  { nome: "Frollini Nocciole (Esselunga Top)", kcal: 505, grassi: 26.0, saturi: 12.0, carboidrati: 58.0, zuccheri: 25.0, fibre: 3.5, proteine: 8.0, sale: 0.40 },
  { nome: "Shortbread (Walkers)", kcal: 533, grassi: 30.3, saturi: 18.9, carboidrati: 58.4, zuccheri: 16.2, fibre: 2.1, proteine: 5.6, sale: 0.70 },
  { nome: "Choco Leibniz (Bahlsen)", kcal: 491, grassi: 22.0, saturi: 14.0, carboidrati: 64.0, zuccheri: 35.0, fibre: 2.8, proteine: 7.8, sale: 0.48 },
  { nome: "Pick Up! (Bahlsen)", kcal: 511, grassi: 26.0, saturi: 15.0, carboidrati: 61.0, zuccheri: 35.0, fibre: 2.5, proteine: 6.7, sale: 0.45 },
  { nome: "Oreo Double Stuff", kcal: 502, grassi: 25.0, saturi: 7.5, carboidrati: 65.0, zuccheri: 45.0, fibre: 1.5, proteine: 3.8, sale: 0.60 },
  { nome: "Milka Sensations (Choco Inside)", kcal: 510, grassi: 27.0, saturi: 13.0, carboidrati: 60.0, zuccheri: 38.0, fibre: 1.8, proteine: 5.3, sale: 0.85 },
  { nome: "Cookie Classico (McEnnedy/Lidl)", kcal: 495, grassi: 24.0, saturi: 12.0, carboidrati: 62.0, zuccheri: 34.0, fibre: 3.0, proteine: 6.0, sale: 0.65 },
  { nome: "Grisbì al Limone (Vicenzi)", kcal: 530, grassi: 30.0, saturi: 13.0, carboidrati: 58.0, zuccheri: 31.0, fibre: 2.0, proteine: 5.5, sale: 0.45 },
  { nome: "Knoten (Biscotti burro danesi)", kcal: 505, grassi: 25.0, saturi: 16.0, carboidrati: 64.0, zuccheri: 24.0, fibre: 1.5, proteine: 5.5, sale: 0.50 },
  { nome: "Settembrini (Mulino Bianco)", kcal: 431, grassi: 15.0, saturi: 7.0, carboidrati: 66.5, zuccheri: 33.0, fibre: 3.3, proteine: 5.8, sale: 0.40 },
  { nome: "Tenerezze Limone (Mulino Bianco)", kcal: 470, grassi: 20.0, saturi: 9.5, carboidrati: 66.5, zuccheri: 25.5, fibre: 1.8, proteine: 5.2, sale: 0.45 },
  { nome: "Gemme di Albicocca (Mulino Bianco)", kcal: 435, grassi: 16.0, saturi: 7.5, carboidrati: 66.0, zuccheri: 32.0, fibre: 2.5, proteine: 5.5, sale: 0.42 },
  { nome: "Cioccograno (Mulino Bianco)", kcal: 475, grassi: 20.5, saturi: 9.0, carboidrati: 62.0, zuccheri: 21.5, fibre: 6.2, proteine: 7.5, sale: 0.65 },
  { nome: "Rigoli Integrali (Mulino Bianco)", kcal: 450, grassi: 16.0, saturi: 1.6, carboidrati: 64.0, zuccheri: 19.0, fibre: 9.5, proteine: 8.0, sale: 0.75 },
  { nome: "Ringo Cacao (Pavesi)", kcal: 488, grassi: 21.5, saturi: 9.8, carboidrati: 66.0, zuccheri: 32.0, fibre: 3.0, proteine: 6.2, sale: 0.48 },
  { nome: "Togo Fondente (Pavesi)", kcal: 505, grassi: 25.0, saturi: 15.0, carboidrati: 62.0, zuccheri: 33.0, fibre: 4.0, proteine: 6.5, sale: 0.40 },
  { nome: "Marie Integrali (Saiwa)", kcal: 425, grassi: 11.5, saturi: 1.2, carboidrati: 68.0, zuccheri: 19.0, fibre: 10.0, proteine: 9.0, sale: 0.80 },
  { nome: "Vitasnella Frollini Cereali", kcal: 435, grassi: 13.0, saturi: 1.5, carboidrati: 69.0, zuccheri: 19.0, fibre: 8.0, proteine: 8.0, sale: 0.75 },
  { nome: "Biscottone (Mulino Bianco)", kcal: 477, grassi: 19.5, saturi: 2.5, carboidrati: 66.2, zuccheri: 21.5, fibre: 4.0, proteine: 7.2, sale: 0.75 },
  { nome: "Zenzerini (Galbusera)", kcal: 445, grassi: 15.0, saturi: 1.7, carboidrati: 70.0, zuccheri: 22.0, fibre: 3.5, proteine: 7.5, sale: 0.80 },
  { nome: "Belvita Miele e Cereali", kcal: 450, grassi: 15.0, saturi: 1.5, carboidrati: 68.0, zuccheri: 20.0, fibre: 7.0, proteine: 7.5, sale: 0.40 },
  { nome: "Belvita Breakfast Cioccolato", kcal: 460, grassi: 16.0, saturi: 4.0, carboidrati: 66.0, zuccheri: 25.0, fibre: 6.5, proteine: 8.0, sale: 0.45 },
  { nome: "Biscotti Farro Gocce (Esselunga)", kcal: 465, grassi: 18.0, saturi: 8.5, carboidrati: 65.0, zuccheri: 24.0, fibre: 5.0, proteine: 8.5, sale: 0.55 },
  { nome: "Novellini Latte e Miele (Campiello)", kcal: 470, grassi: 17.0, saturi: 8.5, carboidrati: 71.0, zuccheri: 25.0, fibre: 1.5, proteine: 7.5, sale: 0.60 },
  { nome: "Ottimini Integrali (Divella)", kcal: 448, grassi: 16.5, saturi: 2.0, carboidrati: 65.0, zuccheri: 18.0, fibre: 8.5, proteine: 8.0, sale: 0.70 },
  { nome: "Ottimini al Cacao (Divella)", kcal: 465, grassi: 18.5, saturi: 8.5, carboidrati: 66.0, zuccheri: 24.0, fibre: 3.5, proteine: 7.5, sale: 0.65 },
  { nome: "Ottimini Gocce Cioccolato (Divella)", kcal: 475, grassi: 20.0, saturi: 9.5, carboidrati: 65.0, zuccheri: 23.0, fibre: 3.0, proteine: 7.5, sale: 0.60 },
  { nome: "Digestive (Conad)", kcal: 480, grassi: 21.0, saturi: 10.0, carboidrati: 63.0, zuccheri: 16.0, fibre: 3.5, proteine: 7.0, sale: 1.20 },
  { nome: "Frollini Cereali (Carrefour Bio)", kcal: 455, grassi: 17.0, saturi: 1.8, carboidrati: 65.0, zuccheri: 20.0, fibre: 7.5, proteine: 8.0, sale: 0.65 },
  { nome: "Petit Beurre (LU)", kcal: 440, grassi: 12.0, saturi: 7.5, carboidrati: 74.0, zuccheri: 23.0, fibre: 2.2, proteine: 8.0, sale: 0.70 },
  { nome: "Bastoncini (Balocco)", kcal: 468, grassi: 17.0, saturi: 2.5, carboidrati: 70.0, zuccheri: 20.0, fibre: 3.5, proteine: 7.0, sale: 0.75 },
  { nome: "Mondine (Balocco)", kcal: 472, grassi: 18.5, saturi: 2.8, carboidrati: 68.0, zuccheri: 19.5, fibre: 3.5, proteine: 7.5, sale: 0.80 },
  { nome: "Paste di Meliga (Monviso)", kcal: 510, grassi: 26.0, saturi: 16.0, carboidrati: 62.0, zuccheri: 22.0, fibre: 2.5, proteine: 6.5, sale: 0.40 },
  { nome: "Tagliatelle all'uovo secche", kcal: 385, grassi: 4.5, saturi: 1.5, carboidrati: 68.0, zuccheri: 2.5, fibre: 3.0, proteine: 15.0, sale: 0.10 },
  { nome: "Pappardelle all'uovo secche", kcal: 385, grassi: 4.5, saturi: 1.5, carboidrati: 68.0, zuccheri: 2.5, fibre: 3.0, proteine: 15.0, sale: 0.10 },
  { nome: "Fettuccine all'uovo secche", kcal: 385, grassi: 4.5, saturi: 1.5, carboidrati: 68.0, zuccheri: 2.5, fibre: 3.0, proteine: 15.0, sale: 0.10 },
  { nome: "Lasagne all'uovo secche", kcal: 380, grassi: 4.0, saturi: 1.3, carboidrati: 69.0, zuccheri: 2.5, fibre: 3.0, proteine: 14.5, sale: 0.10 },
  { nome: "Tagliatelle fresche all'uovo", kcal: 285, grassi: 4.0, saturi: 1.2, carboidrati: 50.0, zuccheri: 1.5, fibre: 2.0, proteine: 11.0, sale: 0.10 },
  { nome: "Pasta ai piselli e proteine grano", kcal: 345, grassi: 3.0, saturi: 0.5, carboidrati: 45.0, zuccheri: 2.5, fibre: 8.0, proteine: 32.0, sale: 0.10 },
  { nome: "Pasta al peperoncino secca", kcal: 355, grassi: 1.6, saturi: 0.3, carboidrati: 70.0, zuccheri: 3.5, fibre: 3.5, proteine: 13.0, sale: 0.02 },
  { nome: "Pasta agli spinaci secca", kcal: 350, grassi: 1.5, saturi: 0.3, carboidrati: 70.0, zuccheri: 3.2, fibre: 4.0, proteine: 12.5, sale: 0.02 },
  { nome: "Tortilla di mais (messicana)", kcal: 220, grassi: 3.0, saturi: 0.5, carboidrati: 44.0, zuccheri: 1.5, fibre: 5.5, proteine: 5.5, sale: 0.20 },
  { nome: "Pane Arabo / Pita", kcal: 275, grassi: 1.2, saturi: 0.2, carboidrati: 56.0, zuccheri: 2.5, fibre: 2.5, proteine: 9.0, sale: 1.30 },
  { nome: "Pane Naan (confezionato)", kcal: 310, grassi: 8.5, saturi: 3.5, carboidrati: 50.0, zuccheri: 4.0, fibre: 2.2, proteine: 9.0, sale: 1.40 },
  { nome: "Grissini torinesi", kcal: 420, grassi: 9.5, saturi: 1.5, carboidrati: 72.0, zuccheri: 3.5, fibre: 3.5, proteine: 11.0, sale: 2.20 },
  { nome: "Grissini integrali", kcal: 395, grassi: 8.0, saturi: 1.2, carboidrati: 65.0, zuccheri: 3.0, fibre: 9.0, proteine: 12.0, sale: 2.10 },
  { nome: "Cracker salati", kcal: 440, grassi: 14.0, saturi: 3.5, carboidrati: 68.0, zuccheri: 2.5, fibre: 3.0, proteine: 10.0, sale: 2.80 },
  { nome: "Cracker integrali", kcal: 420, grassi: 12.5, saturi: 2.0, carboidrati: 62.0, zuccheri: 2.8, fibre: 9.5, proteine: 11.5, sale: 2.30 },
  { nome: "Gallette di riso", kcal: 385, grassi: 2.8, saturi: 0.6, carboidrati: 81.0, zuccheri: 0.5, fibre: 3.0, proteine: 8.0, sale: 0.10 },
  { nome: "Gallette di mais", kcal: 375, grassi: 1.5, saturi: 0.3, carboidrati: 82.0, zuccheri: 0.8, fibre: 4.0, proteine: 7.0, sale: 0.40 },
  { nome: "Fette biscottate classiche", kcal: 390, grassi: 5.5, saturi: 2.5, carboidrati: 72.0, zuccheri: 7.0, fibre: 4.5, proteine: 11.5, sale: 1.40 },
  { nome: "Taralli pugliesi all'olio", kcal: 460, grassi: 19.0, saturi: 2.8, carboidrati: 62.0, zuccheri: 1.5, fibre: 2.5, proteine: 9.5, sale: 2.50 },
  { nome: "Pane croccante (tipo Wasa)", kcal: 335, grassi: 1.5, saturi: 0.3, carboidrati: 62.0, zuccheri: 1.5, fibre: 19.0, proteine: 10.0, sale: 1.20 },
  { nome: "Cracker non salati", kcal: 435, grassi: 13.0, saturi: 1.8, carboidrati: 69.0, zuccheri: 2.2, fibre: 3.2, proteine: 10.0, sale: 1.40 },
  { nome: "Riso Glutinoso (secco)", kcal: 365, grassi: 0.6, saturi: 0.1, carboidrati: 82.0, zuccheri: 0.1, fibre: 1.0, proteine: 6.5, sale: 0.01 },
  { nome: "Riso Sushi (Arborio secco)", kcal: 350, grassi: 0.6, saturi: 0.1, carboidrati: 78.0, zuccheri: 0.1, fibre: 1.0, proteine: 6.5, sale: 0.01 },
  { nome: "Yogurt al malto e miele", kcal: 110, grassi: 3.2, saturi: 2.1, carboidrati: 16.0, zuccheri: 15.5, fibre: 0, proteine: 3.8, sale: 0.12 },
  { nome: "Yogurt malto e miele SL", kcal: 110, grassi: 3.2, saturi: 2.1, carboidrati: 17.0, zuccheri: 16.5, fibre: 0, proteine: 3.5, sale: 0.13 },
  { nome: "Cipolla Bianca", kcal: 40, grassi: 0.1, saturi: 0, carboidrati: 9.3, zuccheri: 4.2, fibre: 1.7, proteine: 1.1, sale: 0.01 },
  { nome: "Cipolla Rossa", kcal: 37, grassi: 0.1, saturi: 0, carboidrati: 8.2, zuccheri: 4.5, fibre: 1.5, proteine: 1.0, sale: 0.01 },
  { nome: "Scalogno", kcal: 72, grassi: 0.1, saturi: 0, carboidrati: 16.8, zuccheri: 7.9, fibre: 3.2, proteine: 2.5, sale: 0.01 },
  { nome: "Aglio (100g)", kcal: 149, grassi: 0.5, saturi: 0.1, carboidrati: 33.0, zuccheri: 1.0, fibre: 2.1, proteine: 6.4, sale: 0.02 },
  { nome: "Porro", kcal: 61, grassi: 0.3, saturi: 0, carboidrati: 14.0, zuccheri: 3.9, fibre: 1.8, proteine: 1.5, sale: 0.02 },
  { nome: "Finocchio", kcal: 31, grassi: 0.2, saturi: 0, carboidrati: 7.3, zuccheri: 3.9, fibre: 3.1, proteine: 1.2, sale: 0.05 },
  { nome: "Sedano", kcal: 16, grassi: 0.2, saturi: 0, carboidrati: 3.0, zuccheri: 1.8, fibre: 1.6, proteine: 0.7, sale: 0.08 },
  { nome: "Asparago", kcal: 20, grassi: 0.1, saturi: 0, carboidrati: 3.9, zuccheri: 1.9, fibre: 2.1, proteine: 2.2, sale: 0.01 },
  { nome: "Carciofo", kcal: 47, grassi: 0.2, saturi: 0, carboidrati: 10.5, zuccheri: 1.0, fibre: 5.4, proteine: 3.3, sale: 0.09 },
  { nome: "Topinambur", kcal: 73, grassi: 0, saturi: 0, carboidrati: 17.4, zuccheri: 9.6, fibre: 1.6, proteine: 2.0, sale: 0.01 },
  { nome: "Barbabietola Rossa", kcal: 43, grassi: 0.2, saturi: 0, carboidrati: 10.0, zuccheri: 6.8, fibre: 2.8, proteine: 1.6, sale: 0.08 },
  { nome: "Fagiolini", kcal: 31, grassi: 0.2, saturi: 0, carboidrati: 7.0, zuccheri: 3.3, fibre: 3.4, proteine: 1.8, sale: 0.01 },
  { nome: "Piselli freschi", kcal: 81, grassi: 0.4, saturi: 0.1, carboidrati: 14.5, zuccheri: 5.7, fibre: 5.1, proteine: 5.4, sale: 0.01 },
  { nome: "Fave fresche", kcal: 88, grassi: 0.7, saturi: 0.1, carboidrati: 17.6, zuccheri: 4.9, fibre: 7.5, proteine: 8.0, sale: 0.01 },
  { nome: "Taccole", kcal: 42, grassi: 0.2, saturi: 0, carboidrati: 7.5, zuccheri: 4.0, fibre: 2.6, proteine: 2.8, sale: 0.01 },
  { nome: "Funghi Champignon", kcal: 22, grassi: 0.3, saturi: 0.1, carboidrati: 3.3, zuccheri: 2.0, fibre: 1.0, proteine: 3.1, sale: 0.01 },
  { nome: "Batavia (Insalata)", kcal: 15, grassi: 0.2, saturi: 0, carboidrati: 2.5, zuccheri: 1.2, fibre: 1.3, proteine: 1.3, sale: 0.02 },
  { nome: "Mizuna", kcal: 22, grassi: 0.3, saturi: 0, carboidrati: 3.5, zuccheri: 1.0, fibre: 2.0, proteine: 2.0, sale: 0.03 },
  { nome: "Cardoncelli (Funghi)", kcal: 38, grassi: 0.4, saturi: 0.1, carboidrati: 5.5, zuccheri: 1.2, fibre: 3.5, proteine: 3.8, sale: 0.01 },
  { nome: "Carota Nera", kcal: 35, grassi: 0.2, saturi: 0, carboidrati: 8.2, zuccheri: 4.0, fibre: 3.0, proteine: 1.0, sale: 0.05 },
  { nome: "Funghi Orecchioni", kcal: 33, grassi: 0.4, saturi: 0.1, carboidrati: 6.0, zuccheri: 1.1, fibre: 2.3, proteine: 3.3, sale: 0.01 },
  { nome: "Funghi Shimeji", kcal: 35, grassi: 0.4, saturi: 0.1, carboidrati: 7.0, zuccheri: 1.0, fibre: 3.0, proteine: 2.5, sale: 0.01 },
  { nome: "Spinacio d'acqua (Kangkong)", kcal: 19, grassi: 0.2, saturi: 0, carboidrati: 3.1, zuccheri: 0.5, fibre: 2.1, proteine: 2.6, sale: 0.11 },
  { nome: "Spinacio Nuova Zelanda", kcal: 14, grassi: 0.2, saturi: 0, carboidrati: 2.5, zuccheri: 0.5, fibre: 0.6, proteine: 1.5, sale: 0.13 },
  { nome: "Micro-bietola", kcal: 20, grassi: 0.2, saturi: 0, carboidrati: 4.0, zuccheri: 1.5, fibre: 1.5, proteine: 2.0, sale: 0.20 },
  { nome: "Micro-cavolo nero", kcal: 45, grassi: 0.8, saturi: 0.1, carboidrati: 8.0, zuccheri: 2.0, fibre: 3.0, proteine: 4.0, sale: 0.04 },
  { nome: "Micro-cilantro", kcal: 23, grassi: 0.5, saturi: 0, carboidrati: 3.7, zuccheri: 0.9, fibre: 2.8, proteine: 2.1, sale: 0.05 },
  { nome: "Micro-prezzemolo", kcal: 36, grassi: 0.8, saturi: 0.1, carboidrati: 6.3, zuccheri: 0.9, fibre: 3.3, proteine: 3.0, sale: 0.06 },
  { nome: "Ceci freschi (verdi)", kcal: 164, grassi: 2.6, saturi: 0.3, carboidrati: 27.4, zuccheri: 4.8, fibre: 7.6, proteine: 8.9, sale: 0.01 },
  { nome: "Pak Choi Piccolo", kcal: 13, grassi: 0.2, saturi: 0, carboidrati: 2.2, zuccheri: 1.2, fibre: 1.0, proteine: 1.5, sale: 0.06 },
  { nome: "Zucca Hokkaido", kcal: 37, grassi: 0.1, saturi: 0, carboidrati: 8.8, zuccheri: 3.5, fibre: 1.8, proteine: 1.3, sale: 0.01 },
  { nome: "Zucca Mantovana", kcal: 26, grassi: 0.1, saturi: 0, carboidrati: 6.5, zuccheri: 2.8, fibre: 0.5, proteine: 1.0, sale: 0.01 },
  { nome: "Zucca Marina di Chioggia", kcal: 28, grassi: 0.1, saturi: 0, carboidrati: 7.0, zuccheri: 3.0, fibre: 0.6, proteine: 1.1, sale: 0.01 },
  { nome: "Zucca Turbante Turco", kcal: 30, grassi: 0.1, saturi: 0, carboidrati: 7.5, zuccheri: 3.2, fibre: 1.0, proteine: 1.2, sale: 0.01 },
  { nome: "Zucchina Napoletana", kcal: 16, grassi: 0.3, saturi: 0.1, carboidrati: 3.1, zuccheri: 2.5, fibre: 1.1, proteine: 1.2, sale: 0.02 },
  { nome: "Zucchina Romanesca", kcal: 17, grassi: 0.3, saturi: 0.1, carboidrati: 3.2, zuccheri: 2.6, fibre: 1.2, proteine: 1.3, sale: 0.02 },
  { nome: "Zucchina Tonda Piacenza", kcal: 16, grassi: 0.2, saturi: 0, carboidrati: 3.3, zuccheri: 2.5, fibre: 1.0, proteine: 1.2, sale: 0.02 },
  { nome: "Zucchina Trombetta Albenga", kcal: 15, grassi: 0.2, saturi: 0, carboidrati: 3.0, zuccheri: 2.2, fibre: 1.0, proteine: 1.1, sale: 0.02 },
  { nome: "Ceci in scatola", kcal: 120, grassi: 2.2, saturi: 0.3, carboidrati: 15.0, zuccheri: 0.8, fibre: 5.5, proteine: 7.0, sale: 0.80 },
  { nome: "Fagioli Borlotti in scatola", kcal: 95, grassi: 0.6, saturi: 0.1, carboidrati: 13.5, zuccheri: 0.5, fibre: 6.2, proteine: 7.0, sale: 0.75 },
  { nome: "Fagioli Cannellini in scatola", kcal: 85, grassi: 0.5, saturi: 0.1, carboidrati: 12.0, zuccheri: 0.5, fibre: 5.8, proteine: 6.5, sale: 0.70 },
  { nome: "Fieno Greco (semi)", kcal: 323, grassi: 6.4, saturi: 0.7, carboidrati: 58.0, zuccheri: 0, fibre: 24.5, proteine: 23.0, sale: 0.17 },
  { nome: "Semi di Sedano", kcal: 392, grassi: 25.0, saturi: 2.2, carboidrati: 41.0, zuccheri: 0.7, fibre: 12.0, proteine: 18.0, sale: 0.40 },
  { nome: "Dragoncello secco", kcal: 295, grassi: 7.0, saturi: 1.8, carboidrati: 50.0, zuccheri: 0, fibre: 7.0, proteine: 23.0, sale: 0.15 },
  { nome: "Cervoglio secco", kcal: 237, grassi: 3.9, saturi: 0.2, carboidrati: 49.0, zuccheri: 0, fibre: 11.0, proteine: 23.0, sale: 0.20 },
  { nome: "Kaffir Lime (foglie)", kcal: 300, grassi: 5.0, saturi: 1.0, carboidrati: 60.0, zuccheri: 0, fibre: 35.0, proteine: 10.0, sale: 0.02 },
  { nome: "Pandan (in polvere)", kcal: 320, grassi: 2.0, saturi: 0.5, carboidrati: 70.0, zuccheri: 5.0, fibre: 15.0, proteine: 6.0, sale: 0.05 },
  { nome: "Pane grattugiato di mais", kcal: 370, grassi: 1.2, saturi: 0.2, carboidrati: 80.0, zuccheri: 1.5, fibre: 3.5, proteine: 8.0, sale: 0.05 },
  { nome: "Farina di Galletta", kcal: 380, grassi: 4.0, saturi: 1.0, carboidrati: 72.0, zuccheri: 5.0, fibre: 3.0, proteine: 12.0, sale: 1.80 },
  { nome: "Beef Jerky", kcal: 280, grassi: 4.0, saturi: 1.8, carboidrati: 11.0, zuccheri: 9.0, fibre: 0, proteine: 50.0, sale: 5.00 },
  { nome: "Affettato Vegano (soia)", kcal: 185, grassi: 9.0, saturi: 1.2, carboidrati: 5.0, zuccheri: 1.5, fibre: 2.5, proteine: 21.0, sale: 2.10 },
  { nome: "Fettine Bresaola sgrassata", kcal: 148, grassi: 1.8, saturi: 0.6, carboidrati: 0.5, zuccheri: 0.5, fibre: 0, proteine: 33.0, sale: 3.90 },
  { nome: "Prosciutto Cotto Light", kcal: 95, grassi: 2.5, saturi: 0.9, carboidrati: 1.0, zuccheri: 0.8, fibre: 0, proteine: 17.0, sale: 1.90 },
  { nome: "Mortadella Light", kcal: 180, grassi: 12.0, saturi: 4.2, carboidrati: 2.0, zuccheri: 1.0, fibre: 0, proteine: 16.0, sale: 2.10 },
  { nome: "Würstel di Suino", kcal: 270, grassi: 24.0, saturi: 9.0, carboidrati: 1.5, zuccheri: 0.5, fibre: 0, proteine: 12.0, sale: 2.30 },
  { nome: "Würstel Pollo e Tacchino", kcal: 220, grassi: 17.0, saturi: 5.5, carboidrati: 2.0, zuccheri: 1.0, fibre: 0, proteine: 14.0, sale: 2.50 },
  { nome: "Würstel con Formaggio", kcal: 295, grassi: 26.0, saturi: 10.5, carboidrati: 2.0, zuccheri: 1.0, fibre: 0, proteine: 13.5, sale: 2.40 },
  { nome: "Nutella (Ferrero)", kcal: 539, grassi: 30.9, saturi: 10.6, carboidrati: 57.5, zuccheri: 56.3, fibre: 0, proteine: 6.3, sale: 0.11 },
  { nome: "Crema Pan di Stelle", kcal: 527, grassi: 30.2, saturi: 5.3, carboidrati: 53.1, zuccheri: 51.0, fibre: 3.8, proteine: 8.3, sale: 0.11 },
  { nome: "Nocciolata Rigoni Asiago", kcal: 530, grassi: 30.0, saturi: 6.0, carboidrati: 53.0, zuccheri: 51.0, fibre: 4.0, proteine: 7.0, sale: 0.10 },
  { nome: "Nocciolata Senza Latte", kcal: 545, grassi: 33.0, saturi: 5.5, carboidrati: 55.0, zuccheri: 53.0, fibre: 5.0, proteine: 5.0, sale: 0.10 },
  { nome: "Nocciolata Bianca", kcal: 540, grassi: 33.0, saturi: 4.6, carboidrati: 52.0, zuccheri: 51.0, fibre: 3.5, proteine: 7.5, sale: 0.10 },
  { nome: "Crema Novi", kcal: 535, grassi: 35.0, saturi: 5.5, carboidrati: 43.0, zuccheri: 41.0, fibre: 6.0, proteine: 10.0, sale: 0.08 },
  { nome: "Valsoia Crema Vegetale", kcal: 540, grassi: 32.0, saturi: 7.0, carboidrati: 56.0, zuccheri: 54.0, fibre: 3.0, proteine: 5.5, sale: 0.10 },
  { nome: "Lotus Biscoff Spread", kcal: 584, grassi: 38.1, saturi: 7.6, carboidrati: 57.0, zuccheri: 36.8, fibre: 0.8, proteine: 2.9, sale: 0.54 },
  { nome: "Lotus Biscoff Crunchy", kcal: 571, grassi: 35.7, saturi: 7.9, carboidrati: 58.8, zuccheri: 36.2, fibre: 0.9, proteine: 2.8, sale: 0.53 },
  { nome: "Peanut Butter Calvé Smooth", kcal: 597, grassi: 48.0, saturi: 7.5, carboidrati: 12.0, zuccheri: 6.4, fibre: 6.3, proteine: 26.0, sale: 1.20 },
  { nome: "Peanut Butter Calvé Crunchy", kcal: 597, grassi: 48.0, saturi: 7.5, carboidrati: 12.0, zuccheri: 6.4, fibre: 6.3, proteine: 26.0, sale: 1.20 },
  { nome: "Skippy Peanut Butter", kcal: 590, grassi: 47.0, saturi: 10.0, carboidrati: 18.0, zuccheri: 10.0, fibre: 6.0, proteine: 22.0, sale: 1.10 },
  { nome: "Ovomaltine Crunchy Cream", kcal: 545, grassi: 32.0, saturi: 7.1, carboidrati: 59.5, zuccheri: 54.5, fibre: 1.8, proteine: 3.8, sale: 0.25 },
  { nome: "Lindt Crema Nocciole", kcal: 550, grassi: 33.0, saturi: 10.0, carboidrati: 52.0, zuccheri: 50.0, fibre: 3.0, proteine: 7.0, sale: 0.10 },
  { nome: "Lindt Crema Fondente", kcal: 530, grassi: 32.0, saturi: 12.0, carboidrati: 50.0, zuccheri: 48.0, fibre: 5.0, proteine: 6.0, sale: 0.10 },
  { nome: "Galak Crema Spalmabile", kcal: 565, grassi: 35.0, saturi: 11.0, carboidrati: 56.0, zuccheri: 56.0, fibre: 0, proteine: 6.5, sale: 0.25 },
  { nome: "Twix Spread", kcal: 560, grassi: 35.0, saturi: 10.0, carboidrati: 56.0, zuccheri: 54.0, fibre: 1.5, proteine: 4.5, sale: 0.25 },
  { nome: "Bounty Spread", kcal: 585, grassi: 39.0, saturi: 14.0, carboidrati: 54.0, zuccheri: 54.0, fibre: 1.5, proteine: 2.5, sale: 0.20 },
  { nome: "Maltesers Teasers Spread", kcal: 545, grassi: 32.0, saturi: 10.0, carboidrati: 59.0, zuccheri: 54.0, fibre: 0, proteine: 4.0, sale: 0.35 },
  { nome: "Venchi Crema Suprema", kcal: 560, grassi: 37.0, saturi: 6.5, carboidrati: 45.0, zuccheri: 41.0, fibre: 0, proteine: 8.5, sale: 0.05 },
  { nome: "Pernigotti Crema Gianduia", kcal: 540, grassi: 34.0, saturi: 6.0, carboidrati: 48.0, zuccheri: 45.0, fibre: 0, proteine: 9.5, sale: 0.05 },
  { nome: "Babbi Cremadelizia", kcal: 545, grassi: 35.0, saturi: 9.0, carboidrati: 50.0, zuccheri: 48.0, fibre: 0, proteine: 8.0, sale: 0.10 },
  { nome: "Marshmallow Fluff Strawberry", kcal: 330, grassi: 0, saturi: 0, carboidrati: 81.0, zuccheri: 48.0, fibre: 0, proteine: 1.0, sale: 0.10 },
  { nome: "Marshmallow Fluff Vanilla", kcal: 330, grassi: 0, saturi: 0, carboidrati: 81.0, zuccheri: 48.0, fibre: 0, proteine: 1.0, sale: 0.10 },
  { nome: "Nesquik (Polvere)", kcal: 380, grassi: 2.0, saturi: 1.0, carboidrati: 80.0, zuccheri: 75.0, fibre: 6.5, proteine: 5.0, sale: 0.15 },
  { nome: "Orzoro (Solubile)", kcal: 350, grassi: 0.5, saturi: 0.2, carboidrati: 75.0, zuccheri: 2.0, fibre: 15.0, proteine: 5.0, sale: 0.20 },
  { nome: "Orata (Fresca)", kcal: 115, grassi: 3.0, saturi: 0.8, carboidrati: 0.0, zuccheri: 0.0, fibre: 0.0, proteine: 20.0, sale: 0.15 },
  { nome: "Sgombro", kcal: 305, grassi: 25.0, saturi: 5.0, carboidrati: 0.0, zuccheri: 0.0, fibre: 0.0, proteine: 19.0, sale: 0.20 },
  { nome: "Sardine (fresche)", kcal: 208, grassi: 14.0, saturi: 3.0, carboidrati: 0.0, zuccheri: 0.0, fibre: 0.0, proteine: 20.0, sale: 0.30 },
  { nome: "Alici (Acciughe)", kcal: 131, grassi: 5.0, saturi: 1.2, carboidrati: 0.0, zuccheri: 0.0, fibre: 0.0, proteine: 20.0, sale: 0.40 },
  { nome: "Gocciole Chocolate (Pavesi)", kcal: 486, grassi: 22.0, grassi_saturi: 6.2, carboidrati: 62.2, zuccheri: 24.0, fibre: 4.4, proteine: 7.5, sale: 0.53 },
  { nome: "Pan di Stelle (Mulino Bianco)", kcal: 483, grassi: 20.5, grassi_saturi: 7.8, carboidrati: 65.0, zuccheri: 23.5, fibre: 4.0, proteine: 7.5, sale: 0.48 },
  { nome: "Macine (Mulino Bianco)", kcal: 482, grassi: 20.0, grassi_saturi: 3.3, carboidrati: 68.0, zuccheri: 19.0, fibre: 2.8, proteine: 6.0, sale: 0.83 },
  { nome: "Oro Saiwa (Saiwa)", kcal: 417, grassi: 8.3, grassi_saturi: 0.8, carboidrati: 76.0, zuccheri: 20.0, fibre: 3.4, proteine: 8.3, sale: 0.62 },
  { nome: "GranTurchese (Colussi)", kcal: 454, grassi: 14.0, grassi_saturi: 1.6, carboidrati: 72.0, zuccheri: 26.0, fibre: 2.4, proteine: 8.7, sale: 0.63 },
  { nome: "Galletti (Mulino Bianco)", kcal: 474, grassi: 18.2, grassi_saturi: 1.9, carboidrati: 68.5, zuccheri: 19.5, fibre: 3.0, proteine: 7.5, sale: 0.73 },
  { nome: "Tarallucci (Mulino Bianco)", kcal: 471, grassi: 18.5, grassi_saturi: 2.0, carboidrati: 67.5, zuccheri: 20.5, fibre: 3.0, proteine: 7.0, sale: 0.68 },
  { nome: "Bucaneve (Doria)", kcal: 465, grassi: 16.5, grassi_saturi: 8.3, carboidrati: 70.7, zuccheri: 23.5, fibre: 2.5, proteine: 7.1, sale: 0.65 },
  { nome: "Abbracci (Mulino Bianco)", kcal: 485, grassi: 21.5, grassi_saturi: 10.2, carboidrati: 63.5, zuccheri: 24.0, fibre: 3.3, proteine: 7.2, sale: 0.63 },
  { nome: "Campagnole (Mulino Bianco)", kcal: 468, grassi: 17.5, grassi_saturi: 3.0, carboidrati: 68.5, zuccheri: 19.5, fibre: 3.5, proteine: 7.3, sale: 0.78 },
  { nome: "Ringo Vaniglia (Pavesi)", kcal: 486, grassi: 21.0, grassi_saturi: 9.5, carboidrati: 67.0, zuccheri: 31.0, fibre: 2.5, proteine: 6.0, sale: 0.45 },
  { nome: "Baiocchi (Mulino Bianco)", kcal: 511, grassi: 26.0, grassi_saturi: 10.5, carboidrati: 59.5, zuccheri: 25.0, fibre: 3.5, proteine: 7.5, sale: 0.45 },
  { nome: "Krumiri (Bistefani)", kcal: 475, grassi: 19.0, grassi_saturi: 10.0, carboidrati: 68.0, zuccheri: 24.0, fibre: 2.0, proteine: 7.0, sale: 0.55 },
  { nome: "Batticuori (Mulino Bianco)", kcal: 472, grassi: 19.0, grassi_saturi: 8.8, carboidrati: 65.7, zuccheri: 23.5, fibre: 4.5, proteine: 7.3, sale: 0.50 },
  { nome: "Rigoli (Mulino Bianco)", kcal: 463, grassi: 16.0, grassi_saturi: 1.5, carboidrati: 70.5, zuccheri: 21.5, fibre: 3.0, proteine: 7.5, sale: 0.70 },
  { nome: "Nascondini (Mulino Bianco)", kcal: 480, grassi: 21.0, grassi_saturi: 10.0, carboidrati: 63.4, zuccheri: 24.0, fibre: 3.3, proteine: 7.6, sale: 0.48 },
  { nome: "Molinetto (Mulino Bianco)", kcal: 482, grassi: 20.5, grassi_saturi: 5.5, carboidrati: 65.0, zuccheri: 22.0, fibre: 3.5, proteine: 7.5, sale: 0.75 },
  { nome: "Spicchi di Sole (Mulino Bianco)", kcal: 472, grassi: 18.5, grassi_saturi: 1.9, carboidrati: 68.0, zuccheri: 19.5, fibre: 3.5, proteine: 7.0, sale: 0.73 },
  { nome: "Pannocchie (Mulino Bianco)", kcal: 471, grassi: 18.5, grassi_saturi: 1.9, carboidrati: 67.5, zuccheri: 20.5, fibre: 4.0, proteine: 6.5, sale: 0.78 },
  { nome: "Buongrano (Mulino Bianco)", kcal: 464, grassi: 18.5, grassi_saturi: 1.9, carboidrati: 63.5, zuccheri: 21.0, fibre: 6.5, proteine: 7.5, sale: 0.70 },
  { nome: "Cuor di Mela (Mulino Bianco)", kcal: 427, grassi: 15.0, grassi_saturi: 7.3, carboidrati: 66.2, zuccheri: 31.5, fibre: 2.8, proteine: 5.5, sale: 0.33 },
  { nome: "Primizie (Mulino Bianco)", kcal: 470, grassi: 18.5, grassi_saturi: 1.9, carboidrati: 67.2, zuccheri: 19.5, fibre: 4.0, proteine: 6.8, sale: 0.75 },
  { nome: "Ritornelli (Mulino Bianco)", kcal: 479, grassi: 20.0, grassi_saturi: 5.3, carboidrati: 66.0, zuccheri: 25.0, fibre: 3.3, proteine: 7.0, sale: 0.53 },
  { nome: "Scacchieri (Mulino Bianco)", kcal: 485, grassi: 22.0, grassi_saturi: 9.8, carboidrati: 62.5, zuccheri: 23.0, fibre: 3.5, proteine: 7.5, sale: 0.45 },
  { nome: "Osvego (Gentilini)", kcal: 450, grassi: 13.8, grassi_saturi: 8.5, carboidrati: 71.5, zuccheri: 22.0, fibre: 3.0, proteine: 8.5, sale: 0.65 },
  { nome: "Novellini (Gentilini)", kcal: 465, grassi: 16.5, grassi_saturi: 11.0, carboidrati: 70.0, zuccheri: 25.5, fibre: 2.0, proteine: 8.0, sale: 0.55 },
  { nome: "Marie (Saiwa)", kcal: 435, grassi: 11.0, grassi_saturi: 1.2, carboidrati: 74.0, zuccheri: 21.0, fibre: 3.0, proteine: 8.5, sale: 0.85 },
  { nome: "Nocciolini (Lazzaroni)", kcal: 460, grassi: 17.0, grassi_saturi: 2.0, carboidrati: 69.0, zuccheri: 30.0, fibre: 2.5, proteine: 6.5, sale: 0.60 },
  { nome: "Oswego (Colussi)", kcal: 440, grassi: 12.0, grassi_saturi: 1.3, carboidrati: 73.0, zuccheri: 21.0, fibre: 3.0, proteine: 8.5, sale: 0.70 },
  { nome: "Zuppalatte (Colussi)", kcal: 436, grassi: 10.0, grassi_saturi: 1.1, carboidrati: 77.0, zuccheri: 22.0, fibre: 2.5, proteine: 8.0, sale: 0.85 },
  { nome: "Frollini con Gocce Cioccolato (Esselunga)", kcal: 480, grassi: 21.0, grassi_saturi: 10.5, carboidrati: 64.0, zuccheri: 24.0, fibre: 3.5, proteine: 6.8, sale: 0.55 },
  { nome: "Biscotti della Salute (Monviso)", kcal: 405, grassi: 6.5, grassi_saturi: 0.8, carboidrati: 74.0, zuccheri: 15.0, fibre: 6.0, proteine: 10.0, sale: 0.40 },
  { nome: "Grancereale Classico (Mulino Bianco)", kcal: 466, grassi: 19.0, grassi_saturi: 2.0, carboidrati: 61.5, zuccheri: 17.5, fibre: 10.0, proteine: 8.0, sale: 0.75 },
  { nome: "Grancereale Croccante (Mulino Bianco)", kcal: 474, grassi: 20.5, grassi_saturi: 2.2, carboidrati: 61.0, zuccheri: 19.0, fibre: 9.0, proteine: 7.0, sale: 0.65 },
  { nome: "Grancereale Cioccolato (Mulino Bianco)", kcal: 477, grassi: 21.0, grassi_saturi: 4.5, carboidrati: 60.0, zuccheri: 21.0, fibre: 9.5, proteine: 7.5, sale: 0.70 },
  { nome: "Grancereale Frutta (Mulino Bianco)", kcal: 457, grassi: 17.5, grassi_saturi: 1.8, carboidrati: 64.0, zuccheri: 23.0, fibre: 8.5, proteine: 6.5, sale: 0.65 },
  { nome: "Privolat Gocce Cioccolato (Misura)", kcal: 458, grassi: 17.0, grassi_saturi: 4.6, carboidrati: 67.0, zuccheri: 22.0, fibre: 4.5, proteine: 7.0, sale: 0.55 },
  { nome: "Fibrextra Integrale (Misura)", kcal: 434, grassi: 15.0, grassi_saturi: 1.5, carboidrati: 60.0, zuccheri: 18.0, fibre: 14.0, proteine: 8.0, sale: 0.75 },
  { nome: "Dolcesenza Senza Zuccheri (Misura)", kcal: 433, grassi: 15.0, grassi_saturi: 1.6, carboidrati: 70.0, zuccheri: 1.0, fibre: 5.5, proteine: 8.5, sale: 0.80 },
  { nome: "Multigrain (Kellogg's)", kcal: 446, grassi: 15.0, grassi_saturi: 1.8, carboidrati: 66.0, zuccheri: 19.0, fibre: 7.5, proteine: 8.0, sale: 0.55 },
  { nome: "Pavesini Classici (Pavesi)", kcal: 392, grassi: 3.5, grassi_saturi: 1.1, carboidrati: 81.3, zuccheri: 48.0, fibre: 2.3, proteine: 7.8, sale: 0.50 },
  { nome: "Magretti (Galbusera)", kcal: 416, grassi: 9.5, grassi_saturi: 1.0, carboidrati: 72.0, zuccheri: 21.5, fibre: 4.0, proteine: 8.5, sale: 0.75 },
  { nome: "Turchese Più Integrale (Colussi)", kcal: 445, grassi: 14.5, grassi_saturi: 1.5, carboidrati: 65.0, zuccheri: 20.0, fibre: 9.0, proteine: 9.0, sale: 0.60 },
  { nome: "Oreo Original (Nabisco)", kcal: 474, grassi: 19.0, grassi_saturi: 5.2, carboidrati: 68.0, zuccheri: 38.0, fibre: 2.7, proteine: 5.4, sale: 0.74 },
  { nome: "Oreo Golden (Nabisco)", kcal: 482, grassi: 20.0, grassi_saturi: 5.5, carboidrati: 69.0, zuccheri: 36.0, fibre: 1.2, proteine: 4.8, sale: 0.55 },
  { nome: "Loacker Wafer Napolitaner", kcal: 511, grassi: 25.0, grassi_saturi: 21.0, carboidrati: 61.0, zuccheri: 30.0, fibre: 3.5, proteine: 8.0, sale: 0.35 },
  { nome: "Nutella Biscuits (Ferrero)", kcal: 513, grassi: 24.5, grassi_saturi: 11.8, carboidrati: 63.3, zuccheri: 34.7, fibre: 3.4, proteine: 6.3, sale: 0.53 },
  { nome: "Kinder Cards (Ferrero)", kcal: 510, grassi: 25.8, grassi_saturi: 15.2, carboidrati: 55.5, zuccheri: 38.0, fibre: 1.5, proteine: 12.8, sale: 0.42 },
  { nome: "Mikado Latte (Mondelez)", kcal: 481, grassi: 19.0, grassi_saturi: 11.0, carboidrati: 68.0, zuccheri: 35.0, fibre: 3.1, proteine: 7.3, sale: 0.70 },
  { nome: "Lotus Biscoff (Lotus)", kcal: 484, grassi: 19.0, grassi_saturi: 8.0, carboidrati: 72.6, zuccheri: 38.1, fibre: 1.3, proteine: 4.9, sale: 0.92 },
  { nome: "Grisbì Cioccolato (Vicenzi)", kcal: 534, grassi: 31.0, grassi_saturi: 13.0, carboidrati: 56.0, zuccheri: 30.0, fibre: 3.5, proteine: 6.0, sale: 0.45 },
  { nome: "Grisbì Nocciola (Vicenzi)", kcal: 540, grassi: 32.0, grassi_saturi: 14.0, carboidrati: 55.0, zuccheri: 28.0, fibre: 2.5, proteine: 6.5, sale: 0.40 },
  { nome: "Krumiri con Gocce (Bistefani)", kcal: 485, grassi: 21.0, grassi_saturi: 11.5, carboidrati: 66.0, zuccheri: 26.0, fibre: 2.5, proteine: 6.8, sale: 0.50 },
  { nome: "Togo Latte (Pavesi)", kcal: 508, grassi: 24.5, grassi_saturi: 14.5, carboidrati: 64.5, zuccheri: 35.5, fibre: 2.5, proteine: 6.0, sale: 0.45 },
  { nome: "Wafer Classic Cacao (Loacker)", kcal: 513, grassi: 25.0, grassi_saturi: 21.0, carboidrati: 60.0, zuccheri: 26.0, fibre: 4.5, proteine: 8.5, sale: 0.38 },
  { nome: "Biscotti Digestive (McVitie's)", kcal: 483, grassi: 21.3, grassi_saturi: 10.1, carboidrati: 62.8, zuccheri: 15.1, fibre: 3.8, proteine: 6.9, sale: 1.3 },
  { nome: "Digestive ai Frutti Rossi (McVitie's)", kcal: 472, grassi: 19.5, grassi_saturi: 9.2, carboidrati: 65.0, zuccheri: 20.5, fibre: 4.5, proteine: 6.5, sale: 1.1 },
  { nome: "Digestive al Cioccolato al Latte (McVitie's)", kcal: 493, grassi: 23.6, grassi_saturi: 12.3, carboidrati: 61.7, zuccheri: 28.5, fibre: 3.0, proteine: 6.7, sale: 0.94 },
  { nome: "Plasmon (Biscotto dei bambini)", kcal: 412, grassi: 8.0, grassi_saturi: 3.5, carboidrati: 75.0, zuccheri: 23.0, fibre: 2.5, proteine: 8.8, sale: 0.50 },
  { nome: "Mellin (Biscotto primi mesi)", kcal: 410, grassi: 8.2, grassi_saturi: 3.7, carboidrati: 74.5, zuccheri: 22.5, fibre: 2.0, proteine: 9.0, sale: 0.45 },
  { nome: "Humana (Biscotto biologico)", kcal: 415, grassi: 8.5, grassi_saturi: 4.0, carboidrati: 73.0, zuccheri: 21.0, fibre: 2.2, proteine: 9.5, sale: 0.40 },
  { nome: "Biscotto Coop (linea Crescendo)", kcal: 408, grassi: 7.5, grassi_saturi: 3.2, carboidrati: 76.0, zuccheri: 24.0, fibre: 2.0, proteine: 8.5, sale: 0.55 },
  { nome: "Ami di Pane (Pavesi)", kcal: 425, grassi: 9.0, grassi_saturi: 1.2, carboidrati: 78.0, zuccheri: 22.0, fibre: 3.0, proteine: 7.5, sale: 0.80 },
  { nome: "Pavesini al Cacao (Pavesi)", kcal: 388, grassi: 3.8, grassi_saturi: 1.3, carboidrati: 79.0, zuccheri: 45.0, fibre: 3.5, proteine: 8.0, sale: 0.48 },
  { nome: "Magretti Gocce Cioccolato (Galbusera)", kcal: 428, grassi: 11.0, grassi_saturi: 2.5, carboidrati: 70.0, zuccheri: 23.0, fibre: 5.0, proteine: 9.0, sale: 0.70 },
  { nome: "Cantuccini alla Mandorla (Sapori)", kcal: 450, grassi: 15.0, grassi_saturi: 3.0, carboidrati: 68.0, zuccheri: 35.0, fibre: 4.5, proteine: 9.0, sale: 0.15 },
  { nome: "Amaretti di Saronno (Lazzaroni)", kcal: 433, grassi: 10.5, grassi_saturi: 1.0, carboidrati: 77.0, zuccheri: 75.0, fibre: 3.0, proteine: 6.5, sale: 0.10 },
  { nome: "Savoiardi (Vicenzi)", kcal: 378, grassi: 3.8, grassi_saturi: 1.1, carboidrati: 76.5, zuccheri: 42.0, fibre: 2.0, proteine: 8.5, sale: 0.22 },
  { nome: "Lingue di Gatto (Vicenzi)", kcal: 460, grassi: 15.0, grassi_saturi: 9.0, carboidrati: 72.0, zuccheri: 38.0, fibre: 1.5, proteine: 8.5, sale: 0.35 },
  { nome: "Ricciarelli di Siena (Sapori)", kcal: 445, grassi: 22.0, grassi_saturi: 2.0, carboidrati: 50.0, zuccheri: 48.0, fibre: 6.0, proteine: 9.5, sale: 0.05 },
  { nome: "Canestrelli (Vicenzi)", kcal: 520, grassi: 28.0, grassi_saturi: 18.0, carboidrati: 60.0, zuccheri: 22.0, fibre: 2.0, proteine: 6.5, sale: 0.30 },
  { nome: "Baci di Dama (Artigianali/GDO)", kcal: 550, grassi: 35.0, grassi_saturi: 15.0, carboidrati: 52.0, zuccheri: 28.0, fibre: 3.0, proteine: 7.5, sale: 0.10 },
  { nome: "Torcetti al Burro (Monviso)", kcal: 495, grassi: 22.0, grassi_saturi: 14.0, carboidrati: 68.0, zuccheri: 25.0, fibre: 2.0, proteine: 6.5, sale: 0.45 },
  { nome: "Colussi Senza Zuccheri Aggiunti", kcal: 430, grassi: 14.0, grassi_saturi: 1.5, carboidrati: 70.0, zuccheri: 0.5, fibre: 6.0, proteine: 9.5, sale: 0.75 },
  { nome: "Misura Fibrextra Miele", kcal: 438, grassi: 15.5, grassi_saturi: 1.6, carboidrati: 61.0, zuccheri: 19.0, fibre: 13.0, proteine: 8.2, sale: 0.72 },
  { nome: "Galbusera BuoniCosì (Senza Zucchero)", kcal: 435, grassi: 16.0, grassi_saturi: 1.8, carboidrati: 68.0, zuccheri: 1.0, fibre: 6.5, proteine: 8.0, sale: 0.85 },
  { nome: "Galbusera RisosuRiso", kcal: 455, grassi: 15.0, grassi_saturi: 1.7, carboidrati: 70.0, zuccheri: 20.0, fibre: 4.5, proteine: 8.5, sale: 0.80 },
  { nome: "Zerograno Frollini (Galbusera - Senza Glutine)", kcal: 465, grassi: 18.0, grassi_saturi: 8.5, carboidrati: 70.0, zuccheri: 20.0, fibre: 3.0, proteine: 4.5, sale: 0.60 },
  { nome: "BioSottile (Probios)", kcal: 410, grassi: 9.5, grassi_saturi: 1.2, carboidrati: 72.0, zuccheri: 18.0, fibre: 5.5, proteine: 8.5, sale: 0.50 },
  { nome: "Sfornatini Integrali (Mulino Bianco)", kcal: 440, grassi: 15.0, grassi_saturi: 1.6, carboidrati: 63.0, zuccheri: 18.5, fibre: 10.0, proteine: 8.5, sale: 0.95 },
  { nome: "Frollini con Nocciole (Esselunga Top)", kcal: 505, grassi: 26.0, grassi_saturi: 12.0, carboidrati: 58.0, zuccheri: 25.0, fibre: 3.5, proteine: 8.0, sale: 0.40 },
  { nome: "Shortbread (Walkers)", kcal: 533, grassi: 30.3, grassi_saturi: 18.9, carboidrati: 58.4, zuccheri: 16.2, fibre: 2.1, proteine: 5.6, sale: 0.70 },
  { nome: "Choco Leibniz (Bahlsen)", kcal: 491, grassi: 22.0, grassi_saturi: 14.0, carboidrati: 64.0, zuccheri: 35.0, fibre: 2.8, proteine: 7.8, sale: 0.48 },
  { nome: "Pick Up! (Bahlsen)", kcal: 511, grassi: 26.0, grassi_saturi: 15.0, carboidrati: 61.0, zuccheri: 35.0, fibre: 2.5, proteine: 6.7, sale: 0.45 },
  { nome: "Oreo Double Stuff", kcal: 502, grassi: 25.0, grassi_saturi: 7.5, carboidrati: 65.0, zuccheri: 45.0, fibre: 1.5, proteine: 3.8, sale: 0.60 },
  { nome: "Milka Sensations (Choco Inside)", kcal: 510, grassi: 27.0, grassi_saturi: 13.0, carboidrati: 60.0, zuccheri: 38.0, fibre: 1.8, proteine: 5.3, sale: 0.85 },
  { nome: "Cookie Classico (McEnnedy/Lidl)", kcal: 495, grassi: 24.0, grassi_saturi: 12.0, carboidrati: 62.0, zuccheri: 34.0, fibre: 3.0, proteine: 6.0, sale: 0.65 },
  { nome: "Grisbì al Limone (Vicenzi)", kcal: 530, grassi: 30.0, grassi_saturi: 13.0, carboidrati: 58.0, zuccheri: 31.0, fibre: 2.0, proteine: 5.5, sale: 0.45 },
  { nome: "Knoten (Biscotti al burro danesi)", kcal: 505, grassi: 25.0, grassi_saturi: 16.0, carboidrati: 64.0, zuccheri: 24.0, fibre: 1.5, proteine: 5.5, sale: 0.50 },
  { nome: "Settembrini (Mulino Bianco)", kcal: 431, grassi: 15.0, grassi_saturi: 7.0, carboidrati: 66.5, zuccheri: 33.0, fibre: 3.3, proteine: 5.8, sale: 0.40 },
  { nome: "Tenerezze al Limone (Mulino Bianco)", kcal: 470, grassi: 20.0, grassi_saturi: 9.5, carboidrati: 66.5, zuccheri: 25.5, fibre: 1.8, proteine: 5.2, sale: 0.45 },
  { nome: "Gemme di Albicocca (Mulino Bianco)", kcal: 435, grassi: 16.0, grassi_saturi: 7.5, carboidrati: 66.0, zuccheri: 32.0, fibre: 2.5, proteine: 5.5, sale: 0.42 },
  { nome: "Cioccograno (Mulino Bianco)", kcal: 475, grassi: 20.5, grassi_saturi: 9.0, carboidrati: 62.0, zuccheri: 21.5, fibre: 6.2, proteine: 7.5, sale: 0.65 },
  { nome: "Rigoli Integrali (Mulino Bianco)", kcal: 450, grassi: 16.0, grassi_saturi: 1.6, carboidrati: 64.0, zuccheri: 19.0, fibre: 9.5, proteine: 8.0, sale: 0.75 },
  { nome: "Ringo Cacao (Pavesi)", kcal: 488, grassi: 21.5, grassi_saturi: 9.8, carboidrati: 66.0, zuccheri: 32.0, fibre: 3.0, proteine: 6.2, sale: 0.48 },
  { nome: "Togo Fondente (Pavesi)", kcal: 505, grassi: 25.0, grassi_saturi: 15.0, carboidrati: 62.0, zuccheri: 33.0, fibre: 4.0, proteine: 6.5, sale: 0.40 },
  { nome: "Marie Integrali (Saiwa)", kcal: 425, grassi: 11.5, grassi_saturi: 1.2, carboidrati: 68.0, zuccheri: 19.0, fibre: 10.0, proteine: 9.0, sale: 0.80 },
  { nome: "Vitasnella Frollini ai Cereali", kcal: 435, grassi: 13.0, grassi_saturi: 1.5, carboidrati: 69.0, zuccheri: 19.0, fibre: 8.0, proteine: 8.0, sale: 0.75 },
  { nome: "Biscottone (Mulino Bianco)", kcal: 477, grassi: 19.5, grassi_saturi: 2.5, carboidrati: 66.2, zuccheri: 21.5, fibre: 4.0, proteine: 7.2, sale: 0.75 },
  { nome: "Zenzerini (Galbusera)", kcal: 445, grassi: 15.0, grassi_saturi: 1.7, carboidrati: 70.0, zuccheri: 22.0, fibre: 3.5, proteine: 7.5, sale: 0.80 },
  { nome: "Belvita Breakfast Miele e Cereali", kcal: 450, grassi: 15.0, grassi_saturi: 1.5, carboidrati: 68.0, zuccheri: 20.0, fibre: 7.0, proteine: 7.5, sale: 0.40 },
  { nome: "Belvita Breakfast Cioccolato", kcal: 460, grassi: 16.0, grassi_saturi: 4.0, carboidrati: 66.0, zuccheri: 25.0, fibre: 6.5, proteine: 8.0, sale: 0.45 },
  { nome: "Biscotti Farro e Gocce (Esselunga Bio)", kcal: 465, grassi: 18.0, grassi_saturi: 8.5, carboidrati: 65.0, zuccheri: 24.0, fibre: 5.0, proteine: 8.5, sale: 0.55 },
  { nome: "Novellini al Latte e Miele (Campiello)", kcal: 470, grassi: 17.0, grassi_saturi: 8.5, carboidrati: 71.0, zuccheri: 25.0, fibre: 1.5, proteine: 7.5, sale: 0.60 },
  { nome: "Ottimini Integrali (Divella)", kcal: 448, grassi: 16.5, grassi_saturi: 2.0, carboidrati: 65.0, zuccheri: 18.0, fibre: 8.5, proteine: 8.0, sale: 0.70 },
  { nome: "Ottimini al Cacao (Divella)", kcal: 465, grassi: 18.5, grassi_saturi: 8.5, carboidrati: 66.0, zuccheri: 24.0, fibre: 3.5, proteine: 7.5, sale: 0.65 },
  { nome: "Ottimini con Gocce di Cioccolato (Divella)", kcal: 475, grassi: 20.0, grassi_saturi: 9.5, carboidrati: 65.0, zuccheri: 23.0, fibre: 3.0, proteine: 7.5, sale: 0.60 },
  { nome: "Digestive (Conad)", kcal: 480, grassi: 21.0, grassi_saturi: 10.0, carboidrati: 63.0, zuccheri: 16.0, fibre: 3.5, proteine: 7.0, sale: 1.2 },
  { nome: "Frollini ai Cereali (Carrefour Bio)", kcal: 455, grassi: 17.0, grassi_saturi: 1.8, carboidrati: 65.0, zuccheri: 20.0, fibre: 7.5, proteine: 8.0, sale: 0.65 },
  { nome: "Petit Beurre (LU)", kcal: 440, grassi: 12.0, grassi_saturi: 7.5, carboidrati: 74.0, zuccheri: 23.0, fibre: 2.2, proteine: 8.0, sale: 0.70 },
  { nome: "Bastoncini (Balocco)", kcal: 468, grassi: 17.0, grassi_saturi: 2.5, carboidrati: 70.0, zuccheri: 20.0, fibre: 3.5, proteine: 7.0, sale: 0.75 },
  { nome: "Mondine (Balocco)", kcal: 472, grassi: 18.5, grassi_saturi: 2.8, carboidrati: 68.0, zuccheri: 19.5, fibre: 3.5, proteine: 7.5, sale: 0.80 },
  { nome: "Paste di Meliga (Monviso)", kcal: 510, grassi: 26.0, grassi_saturi: 16.0, carboidrati: 62.0, zuccheri: 22.0, fibre: 2.5, proteine: 6.5, sale: 0.40 },
  { nome: "Jujube (Dattero cinese secco)", kcal: 287, grassi: 1.1, carboidrati: 73.0, fibre: 6.0, proteine: 3.7, micronutrienti: "Vitamina C, Potassio" },
  { nome: "Longan (Occhio di drago)", kcal: 60, grassi: 0.1, carboidrati: 15.1, fibre: 1.1, proteine: 1.3, micronutrienti: "Vitamina C, Rame" },
  { nome: "Lucuma (polvere)", kcal: 329, grassi: 1.0, carboidrati: 80.0, fibre: 20.0, proteine: 4.0, micronutrienti: "Zinco, Ferro, Niacina" },
  { nome: "Noni", kcal: 15, grassi: 0.1, carboidrati: 3.4, fibre: 1.0, proteine: 0.5, micronutrienti: "Vitamina C, Potassio" },
  { nome: "Pepino (Melone-pera)", kcal: 25, grassi: 0.1, carboidrati: 6.0, fibre: 1.5, proteine: 0.4, micronutrienti: "Vitamina C, Vitamina A" },
  { nome: "Physalis (Alkekengi)", kcal: 53, grassi: 0.7, carboidrati: 11.2, fibre: 0.0, proteine: 1.9, micronutrienti: "Vitamina A, Niacina" },
  { nome: "Platano (Verde)", kcal: 122, grassi: 0.4, carboidrati: 31.9, fibre: 2.3, proteine: 1.3, micronutrienti: "Vitamina B6, Potassio" },
  { nome: "Salak (Frutto serpente)", kcal: 82, grassi: 0.4, carboidrati: 21.0, fibre: 0.5, proteine: 0.8, micronutrienti: "Ferro, Vitamina C" },
  { nome: "Santol", kcal: 50, grassi: 0.2, carboidrati: 13.0, fibre: 1.5, proteine: 0.7, micronutrienti: "Vitamina C, Calcio" },
  { nome: "Agnolotti piemontesi (confezionati)", kcal: 280, grassi: 9.0, grassi_saturi: 3.5, carboidrati: 35.0, zuccheri: 1.5, fibre: 2.5, proteine: 13.5, sale: 1.00 },
  { nome: "Anelletti siciliani (secca) (confezionati)", kcal: 355, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 71.0, zuccheri: 3.5, fibre: 3.0, proteine: 13.0, sale: 0.01 },
  { nome: "Baguette", kcal: 285, grassi: 1.2, grassi_saturi: 0.3, carboidrati: 59.0, zuccheri: 3.0, fibre: 2.8, proteine: 8.5, sale: 1.60 },
  { nome: "Bucatini (confezionati)", kcal: 355, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 71.0, zuccheri: 3.5, fibre: 3.0, proteine: 13.0, sale: 0.01 },
  { nome: "Burger Buns (Pane per Hamburger) (confezionato)", kcal: 295, grassi: 6.5, grassi_saturi: 2.5, carboidrati: 50.0, zuccheri: 8.5, fibre: 2.5, proteine: 9.5, sale: 1.35 },
  { nome: "Cannelloni ricotta e spinaci surgelati (confezionati)", kcal: 150, grassi: 7.5, grassi_saturi: 4.0, carboidrati: 13.0, zuccheri: 2.5, fibre: 1.8, proteine: 6.8, sale: 0.85 },
  { nome: "Cannelloni secchi (confezionati)", kcal: 355, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 71.0, zuccheri: 3.5, fibre: 3.0, proteine: 13.0, sale: 0.01 },
  { nome: "Cappelletti al prosciutto crudo (confezionati)", kcal: 305, grassi: 9.0, grassi_saturi: 4.0, carboidrati: 41.0, zuccheri: 2.0, fibre: 2.5, proteine: 14.0, sale: 1.20 },
  { nome: "Cavallucci/Gnocchetti sardi secchi (confezionati)", kcal: 355, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 71.0, zuccheri: 3.5, fibre: 3.0, proteine: 13.0, sale: 0.01 },
  { nome: "Chicche di patate (confezionati)", kcal: 165, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 35.0, zuccheri: 1.0, fibre: 1.5, proteine: 3.5, sale: 1.10 },
  { nome: "Cracker ai cereali antichi (quinoa/semi di chia)", kcal: 438, grassi: 16.0, grassi_saturi: 2.0, carboidrati: 59.0, zuccheri: 3.0, fibre: 7.0, proteine: 11.5, sale: 2.00 },
  { nome: "Cracker al riso soffiato", kcal: 410, grassi: 8.5, grassi_saturi: 1.2, carboidrati: 74.0, zuccheri: 2.0, fibre: 2.5, proteine: 8.5, sale: 1.80 },
  { nome: "Cracker alla soia", kcal: 425, grassi: 14.5, grassi_saturi: 2.1, carboidrati: 58.0, zuccheri: 2.5, fibre: 5.5, proteine: 14.0, sale: 2.10 },
  { nome: "Cracker con farina di ceci", kcal: 415, grassi: 12.0, grassi_saturi: 1.5, carboidrati: 54.0, zuccheri: 2.2, fibre: 9.0, proteine: 18.0, sale: 1.90 },
  { nome: "Cracker integrali (confezionati)", kcal: 420, grassi: 12.5, grassi_saturi: 2.0, carboidrati: 62.0, zuccheri: 2.8, fibre: 9.5, proteine: 11.5, sale: 2.30 },
  { nome: "Cracker non salati in superficie", kcal: 435, grassi: 13.0, grassi_saturi: 1.8, carboidrati: 69.0, zuccheri: 2.2, fibre: 3.2, proteine: 10.0, sale: 1.40 },
  { nome: "Cracker salati (confezionati)", kcal: 440, grassi: 14.0, grassi_saturi: 3.5, carboidrati: 68.0, zuccheri: 2.5, fibre: 3.0, proteine: 10.0, sale: 2.80 },
  { nome: "Cracker senza glutine (riso/mais)", kcal: 450, grassi: 15.0, grassi_saturi: 1.8, carboidrati: 75.0, zuccheri: 1.5, fibre: 2.0, proteine: 4.0, sale: 2.50 },
  { nome: "Culurgiones (confezionati)", kcal: 220, grassi: 6.0, grassi_saturi: 3.0, carboidrati: 33.0, zuccheri: 1.5, fibre: 2.5, proteine: 7.5, sale: 0.90 },
  { nome: "Ditalini (confezionati)", kcal: 355, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 71.0, zuccheri: 3.5, fibre: 3.0, proteine: 13.0, sale: 0.01 },
  { nome: "Farfalle (confezionati)", kcal: 357, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 72.0, zuccheri: 3.5, fibre: 3.0, proteine: 12.5, sale: 0.01 },
  { nome: "Fette biscottate classiche", kcal: 390, grassi: 5.5, grassi_saturi: 2.5, carboidrati: 72.0, zuccheri: 7.0, fibre: 4.5, proteine: 11.5, sale: 1.40 },
  { nome: "Fettuccine all'uovo secche (confezionati)", kcal: 385, grassi: 4.5, grassi_saturi: 1.5, carboidrati: 68.0, zuccheri: 2.5, fibre: 3.0, proteine: 15.0, sale: 0.10 },
  { nome: "Focaccia liscia (fresca)", kcal: 310, grassi: 10.0, grassi_saturi: 1.5, carboidrati: 48.0, zuccheri: 2.0, fibre: 2.0, proteine: 7.5, sale: 2.20 },
  { nome: "Fregola sarda tostata (secca) (confezionata)", kcal: 358, grassi: 1.6, grassi_saturi: 0.3, carboidrati: 72.0, zuccheri: 3.2, fibre: 3.5, proteine: 12.5, sale: 0.02 },
  { nome: "Fusilli (confezionati)", kcal: 355, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 71.0, zuccheri: 3.5, fibre: 3.0, proteine: 13.0, sale: 0.01 },
  { nome: "Fusilli proteici ai piselli e proteine del grano (confezionata)", kcal: 345, grassi: 3.0, grassi_saturi: 0.5, carboidrati: 45.0, zuccheri: 2.5, fibre: 8.0, proteine: 32.0, sale: 0.10 },
  { nome: "Gallette di mais", kcal: 375, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 82.0, zuccheri: 0.8, fibre: 4.0, proteine: 7.0, sale: 0.40 },
  { nome: "Gallette di riso", kcal: 385, grassi: 2.8, grassi_saturi: 0.6, carboidrati: 81.0, zuccheri: 0.5, fibre: 3.0, proteine: 8.0, sale: 0.10 },
  { nome: "Gnocchi alla romana (confezionati/pronti)", kcal: 185, grassi: 9.0, grassi_saturi: 5.5, carboidrati: 19.0, zuccheri: 1.5, fibre: 1.0, proteine: 6.5, sale: 1.30 },
  { nome: "Gnocchi di patate (confezionati/freschi)", kcal: 160, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 34.0, zuccheri: 1.0, fibre: 1.5, proteine: 3.5, sale: 1.10 },
  { nome: "Gnocchi di patate ripieni di formaggio (confezionati)", kcal: 195, grassi: 4.5, grassi_saturi: 2.5, carboidrati: 32.0, zuccheri: 1.5, fibre: 1.5, proteine: 5.5, sale: 1.20 },
  { nome: "Gnocchi di patate surgelati (confezionati)", kcal: 155, grassi: 0.4, grassi_saturi: 0.1, carboidrati: 33.0, zuccheri: 1.0, fibre: 1.8, proteine: 3.5, sale: 1.00 },
  { nome: "Grissini integrali (confezionati)", kcal: 395, grassi: 8.0, grassi_saturi: 1.2, carboidrati: 65.0, zuccheri: 3.0, fibre: 9.0, proteine: 12.0, sale: 2.10 },
  { nome: "Grissini torinesi (confezionati)", kcal: 420, grassi: 9.5, grassi_saturi: 1.5, carboidrati: 72.0, zuccheri: 3.5, fibre: 3.5, proteine: 11.0, sale: 2.20 },
  { nome: "Hot Dog Rolls (confezionato)", kcal: 300, grassi: 7.0, grassi_saturi: 2.8, carboidrati: 51.0, zuccheri: 9.0, fibre: 2.3, proteine: 9.0, sale: 1.40 },
  { nome: "Jujube (Dattero cinese secco)", kcal: 287, grassi: 1.1, grassi_saturi: 0, carboidrati: 73.0, zuccheri: 0, fibre: 6.0, proteine: 3.7, sale: 0 },
  { nome: "Lasagne alla bolognese surgelate (confezionati)", kcal: 165, grassi: 8.5, grassi_saturi: 4.2, carboidrati: 14.0, zuccheri: 2.8, fibre: 1.5, proteine: 7.5, sale: 0.95 },
  { nome: "Lasagne all'uovo secche (confezionati)", kcal: 380, grassi: 4.0, grassi_saturi: 1.3, carboidrati: 69.0, zuccheri: 2.5, fibre: 3.0, proteine: 14.5, sale: 0.10 },
  { nome: "Lasagne secche di semola (confezionati)", kcal: 355, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 71.0, zuccheri: 3.5, fibre: 3.0, proteine: 13.0, sale: 0.01 },
  { nome: "Linguine (confezionati)", kcal: 355, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 71.0, zuccheri: 3.5, fibre: 3.0, proteine: 13.0, sale: 0.01 },
  { nome: "Longan (Occhio di drago)", kcal: 60, grassi: 0.1, grassi_saturi: 0, carboidrati: 15.1, zuccheri: 0, fibre: 1.1, proteine: 1.3, sale: 0 },
  { nome: "Lucuma (polvere)", kcal: 329, grassi: 1.0, grassi_saturi: 0, carboidrati: 80.0, zuccheri: 0, fibre: 20.0, proteine: 4.0, sale: 0 },
  { nome: "Mezze Maniche (confezionati)", kcal: 355, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 71.0, zuccheri: 3.5, fibre: 3.0, proteine: 13.0, sale: 0.01 },
  { nome: "Michetta / Rosetta", kcal: 275, grassi: 1.0, grassi_saturi: 0.2, carboidrati: 58.0, zuccheri: 2.5, fibre: 2.5, proteine: 9.0, sale: 1.55 },
  { nome: "Noni", kcal: 15, grassi: 0.1, grassi_saturi: 0, carboidrati: 3.4, zuccheri: 0, fibre: 1.0, proteine: 0.5, sale: 0 },
  { nome: "Noodles di frumento (confezionati/secchi)", kcal: 360, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 73.0, zuccheri: 2.0, fibre: 2.5, proteine: 12.0, sale: 0.50 },
  { nome: "Noodles di riso (confezionati/secchi)", kcal: 350, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 80.0, zuccheri: 0.1, fibre: 1.0, proteine: 6.0, sale: 0.10 },
  { nome: "Orecchiette secche (confezionati)", kcal: 352, grassi: 1.3, grassi_saturi: 0.3, carboidrati: 71.5, zuccheri: 3.0, fibre: 3.0, proteine: 12.0, sale: 0.01 },
  { nome: "Paccheri (confezionati)", kcal: 355, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 71.0, zuccheri: 3.5, fibre: 3.0, proteine: 13.0, sale: 0.01 },
  { nome: "Pan Bauletto ai Cereali e Semi (confezionato)", kcal: 285, grassi: 7.5, grassi_saturi: 1.0, carboidrati: 41.0, zuccheri: 4.5, fibre: 6.5, proteine: 10.5, sale: 1.25 },
  { nome: "Pan Bauletto Bianco (confezionato)", kcal: 265, grassi: 3.5, grassi_saturi: 0.8, carboidrati: 49.0, zuccheri: 5.5, fibre: 2.5, proteine: 8.0, sale: 1.30 },
  { nome: "Pan Bauletto Integrale (confezionato)", kcal: 255, grassi: 4.0, grassi_saturi: 0.6, carboidrati: 42.0, zuccheri: 5.0, fibre: 7.5, proteine: 9.5, sale: 1.20 },
  { nome: "Pancarré classico (confezionato)", kcal: 285, grassi: 4.5, grassi_saturi: 1.2, carboidrati: 52.0, zuccheri: 5.0, fibre: 3.0, proteine: 8.5, sale: 1.50 },
  { nome: "Pane ai cereali", kcal: 270, grassi: 4.5, grassi_saturi: 0.8, carboidrati: 48.0, zuccheri: 2.5, fibre: 5.5, proteine: 10.0, sale: 1.40 },
  { nome: "Pane all'olio", kcal: 305, grassi: 6.5, grassi_saturi: 1.2, carboidrati: 53.0, zuccheri: 3.0, fibre: 2.5, proteine: 8.0, sale: 1.60 },
  { nome: "Pane Americano (Sandwich) (confezionato)", kcal: 280, grassi: 5.5, grassi_saturi: 2.0, carboidrati: 47.0, zuccheri: 7.0, fibre: 2.5, proteine: 9.0, sale: 1.50 },
  { nome: "Pane Arabo / Pita", kcal: 275, grassi: 1.2, grassi_saturi: 0.2, carboidrati: 56.0, zuccheri: 2.5, fibre: 2.5, proteine: 9.0, sale: 1.30 },
  { nome: "Pane azzimo (senza lievito)", kcal: 365, grassi: 1.2, grassi_saturi: 0.2, carboidrati: 77.0, zuccheri: 1.5, fibre: 3.0, proteine: 11.0, sale: 0.05 },
  { nome: "Pane comune (tipo 0)", kcal: 265, grassi: 1.3, grassi_saturi: 0.3, carboidrati: 54.0, zuccheri: 2.5, fibre: 2.7, proteine: 8.5, sale: 1.50 },
  { nome: "Pane croccante (tipo Wasa)", kcal: 335, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 62.0, zuccheri: 1.5, fibre: 19.0, proteine: 10.0, sale: 1.20 },
  { nome: "Pane di farro", kcal: 260, grassi: 2.2, grassi_saturi: 0.4, carboidrati: 50.0, zuccheri: 2.0, fibre: 5.0, proteine: 10.5, sale: 1.35 },
  { nome: "Pane di grano duro (tipo Altamura)", kcal: 275, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 56.0, zuccheri: 2.0, fibre: 3.2, proteine: 9.5, sale: 1.40 },
  { nome: "Pane di mais", kcal: 280, grassi: 3.0, grassi_saturi: 0.5, carboidrati: 55.0, zuccheri: 2.5, fibre: 3.0, proteine: 7.5, sale: 1.40 },
  { nome: "Pane di segale (Nero)", kcal: 230, grassi: 1.5, grassi_saturi: 0.2, carboidrati: 45.0, zuccheri: 2.0, fibre: 8.0, proteine: 7.5, sale: 1.40 },
  { nome: "Pane di segale confezionato (tipo Pumpernickel)", kcal: 210, grassi: 1.2, grassi_saturi: 0.2, carboidrati: 38.0, zuccheri: 3.5, fibre: 9.5, proteine: 6.0, sale: 1.20 },
  { nome: "Pane di zucca", kcal: 260, grassi: 3.5, grassi_saturi: 0.6, carboidrati: 48.0, zuccheri: 4.5, fibre: 3.5, proteine: 8.0, sale: 1.30 },
  { nome: "Pane integrale fresco", kcal: 245, grassi: 2.0, grassi_saturi: 0.4, carboidrati: 46.0, zuccheri: 2.2, fibre: 6.5, proteine: 9.0, sale: 1.30 },
  { nome: "Pane al latte", kcal: 315, grassi: 7.5, grassi_saturi: 4.5, carboidrati: 52.0, zuccheri: 5.5, fibre: 2.2, proteine: 9.0, sale: 1.50 },
  { nome: "Pane Naan (confezionato)", kcal: 310, grassi: 8.5, grassi_saturi: 3.5, carboidrati: 50.0, zuccheri: 4.0, fibre: 2.2, proteine: 9.0, sale: 1.40 },
  { nome: "Pane per Tramezzini (senza crosta) (confezionato)", kcal: 275, grassi: 5.0, grassi_saturi: 1.5, carboidrati: 48.0, zuccheri: 6.0, fibre: 2.2, proteine: 8.5, sale: 1.40 },
  { nome: "Pappardelle all'uovo secche (confezionati)", kcal: 385, grassi: 4.5, grassi_saturi: 1.5, carboidrati: 68.0, zuccheri: 2.5, fibre: 3.0, proteine: 15.0, sale: 0.10 },
  { nome: "Passatelli freschi (confezionati/banco frigo)", kcal: 310, grassi: 12.0, grassi_saturi: 5.0, carboidrati: 32.0, zuccheri: 1.5, fibre: 1.5, proteine: 18.0, sale: 1.20 },
  { nome: "Pasta agli spinaci (confezionata)", kcal: 350, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 70.0, zuccheri: 3.2, fibre: 4.0, proteine: 12.5, sale: 0.05 },
  { nome: "Pasta al limone e pepe (confezionata)", kcal: 352, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 71.0, zuccheri: 3.5, fibre: 3.0, proteine: 12.5, sale: 0.02 },
  { nome: "Pasta al nero di seppia (confezionata)", kcal: 358, grassi: 1.8, grassi_saturi: 0.4, carboidrati: 69.0, zuccheri: 3.0, fibre: 3.0, proteine: 14.0, sale: 0.50 },
  { nome: "Pasta al peperoncino (confezionata)", kcal: 355, grassi: 1.6, grassi_saturi: 0.3, carboidrati: 70.0, zuccheri: 3.5, fibre: 3.5, proteine: 13.0, sale: 0.02 },
  { nome: "Pasta al tartufo (confezionata)", kcal: 360, grassi: 2.0, grassi_saturi: 0.5, carboidrati: 70.0, zuccheri: 3.0, fibre: 3.0, proteine: 13.5, sale: 0.10 },
  { nome: "Pasta alla barbabietola (confezionata)", kcal: 350, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 71.0, zuccheri: 4.0, fibre: 4.0, proteine: 12.0, sale: 0.05 },
  { nome: "Pasta alla curcuma e zenzero (confezionata)", kcal: 355, grassi: 1.7, grassi_saturi: 0.4, carboidrati: 70.0, zuccheri: 3.0, fibre: 3.5, proteine: 12.8, sale: 0.02 },
  { nome: "Pasta d'Orzo (confezionati)", kcal: 345, grassi: 2.0, grassi_saturi: 0.4, carboidrati: 68.0, zuccheri: 2.0, fibre: 6.0, proteine: 11.0, sale: 0.01 },
  { nome: "Pasta di canapa (confezionata)", kcal: 345, grassi: 4.0, grassi_saturi: 0.6, carboidrati: 60.0, zuccheri: 2.0, fibre: 9.0, proteine: 16.0, sale: 0.02 },
  { nome: "Pasta di Ceci (confezionati)", kcal: 355, grassi: 4.5, grassi_saturi: 0.6, carboidrati: 49.0, zuccheri: 2.0, fibre: 13.0, proteine: 22.0, sale: 0.01 },
  { nome: "Pasta di Fagioli Neri (confezionati)", kcal: 325, grassi: 2.5, grassi_saturi: 0.5, carboidrati: 40.0, zuccheri: 2.5, fibre: 15.0, proteine: 28.0, sale: 0.01 },
  { nome: "Pasta di farina di lupini (confezionata)", kcal: 325, grassi: 7.0, grassi_saturi: 1.0, carboidrati: 12.0, zuccheri: 3.0, fibre: 30.0, proteine: 38.0, sale: 0.05 },
  { nome: "Pasta di Farro (confezionati)", kcal: 340, grassi: 2.5, grassi_saturi: 0.4, carboidrati: 63.0, zuccheri: 2.5, fibre: 7.0, proteine: 13.0, sale: 0.01 },
  { nome: "Pasta di Grano Saraceno (confezionati)", kcal: 345, grassi: 2.5, grassi_saturi: 0.5, carboidrati: 67.0, zuccheri: 1.0, fibre: 4.5, proteine: 11.0, sale: 0.01 },
  { nome: "Pasta di Kamut/Khorasan (confezionati)", kcal: 357, grassi: 2.1, grassi_saturi: 0.4, carboidrati: 67.0, zuccheri: 2.8, fibre: 6.5, proteine: 14.5, sale: 0.01 },
  { nome: "Pasta di Lenticchie Rosse (confezionati)", kcal: 335, grassi: 1.7, grassi_saturi: 0.4, carboidrati: 50.0, zuccheri: 1.5, fibre: 11.0, proteine: 25.0, sale: 0.01 },
  { nome: "Pasta di Mais (confezionati)", kcal: 360, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 78.0, zuccheri: 0.5, fibre: 2.0, proteine: 7.0, sale: 0.01 },
  { nome: "Pasta di Mais e Riso (confezionati)", kcal: 358, grassi: 1.3, grassi_saturi: 0.3, carboidrati: 78.5, zuccheri: 0.4, fibre: 1.8, proteine: 7.0, sale: 0.01 },
  { nome: "Pasta di mais viola (confezionata)", kcal: 355, grassi: 1.8, grassi_saturi: 0.4, carboidrati: 76.0, zuccheri: 0.8, fibre: 3.5, proteine: 7.5, sale: 0.01 },
  { nome: "Pasta di Piselli Verdi (confezionati)", kcal: 340, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 54.0, zuccheri: 2.5, fibre: 10.0, proteine: 20.0, sale: 0.01 },
  { nome: "Pasta di Quinoa e Riso (confezionati)", kcal: 362, grassi: 2.0, grassi_saturi: 0.4, carboidrati: 75.0, zuccheri: 0.8, fibre: 3.0, proteine: 9.0, sale: 0.01 },
  { nome: "Pasta di Riso (confezionati)", kcal: 355, grassi: 1.0, grassi_saturi: 0.3, carboidrati: 79.0, zuccheri: 0.2, fibre: 1.5, proteine: 7.0, sale: 0.01 },
  { nome: "Pasta di Segale (confezionati)", kcal: 335, grassi: 1.8, grassi_saturi: 0.3, carboidrati: 66.0, zuccheri: 2.0, fibre: 12.0, proteine: 9.5, sale: 0.01 },
  { nome: "Pasta di teff (confezionata)", kcal: 340, grassi: 2.2, grassi_saturi: 0.5, carboidrati: 68.0, zuccheri: 1.5, fibre: 7.5, proteine: 11.0, sale: 0.02 },
  { nome: "Pasta Integrale (confezionati)", kcal: 348, grassi: 2.5, grassi_saturi: 0.5, carboidrati: 64.0, zuccheri: 3.3, fibre: 8.0, proteine: 13.5, sale: 0.01 },
  { nome: "Pasta proteica a base di soia (confezionata)", kcal: 330, grassi: 6.0, grassi_saturi: 1.0, carboidrati: 15.0, zuccheri: 4.0, fibre: 20.0, proteine: 45.0, sale: 0.02 },
  { nome: "Pasta proteica con albume d'uovo (confezionata)", kcal: 350, grassi: 2.5, grassi_saturi: 0.8, carboidrati: 50.0, zuccheri: 2.0, fibre: 6.0, proteine: 30.0, sale: 0.15 },
  { nome: "Pasta tricolore (pomodoro/spinaci/semola) (confezionata)", kcal: 353, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 71.0, zuccheri: 3.5, fibre: 3.2, proteine: 12.5, sale: 0.03 },
  { nome: "Penne all'arrabbiata surgelate (piatto pronto) (confezionati)", kcal: 140, grassi: 4.5, grassi_saturi: 0.7, carboidrati: 19.0, zuccheri: 2.5, fibre: 2.0, proteine: 4.5, sale: 0.90 },
  { nome: "Penne Rigate (confezionati)", kcal: 355, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 71.0, zuccheri: 3.5, fibre: 3.0, proteine: 13.0, sale: 0.01 },
  { nome: "Pepino (Melone-pera)", kcal: 25, grassi: 0.1, grassi_saturi: 0, carboidrati: 6.0, zuccheri: 0, fibre: 1.5, proteine: 0.4, sale: 0 },
  { nome: "Physalis (Alkekengi)", kcal: 53, grassi: 0.7, grassi_saturi: 0, carboidrati: 11.2, zuccheri: 0, fibre: 0, proteine: 1.9, sale: 0 },
  { nome: "Piadina al farro (confezionata)", kcal: 300, grassi: 9.5, grassi_saturi: 1.2, carboidrati: 46.0, zuccheri: 1.8, fibre: 5.0, proteine: 9.0, sale: 1.80 },
  { nome: "Piadina integrale (confezionata)", kcal: 290, grassi: 8.5, grassi_saturi: 1.0, carboidrati: 44.0, zuccheri: 2.2, fibre: 6.5, proteine: 8.5, sale: 1.70 },
  { nome: "Piadina Romagnola all'olio (confezionata)", kcal: 310, grassi: 9.0, grassi_saturi: 1.2, carboidrati: 50.0, zuccheri: 2.0, fibre: 2.5, proteine: 7.5, sale: 1.80 },
  { nome: "Piadina Romagnola allo strutto (confezionata)", kcal: 340, grassi: 14.0, grassi_saturi: 5.5, carboidrati: 46.0, zuccheri: 1.5, fibre: 2.2, proteine: 7.0, sale: 1.90 },
  { nome: "Pici toscani secchi (confezionati)", kcal: 350, grassi: 1.4, grassi_saturi: 0.3, carboidrati: 70.0, zuccheri: 3.0, fibre: 3.0, proteine: 12.5, sale: 0.01 },
  { nome: "Platano (Verde)", kcal: 122, grassi: 0.4, grassi_saturi: 0, carboidrati: 31.9, zuccheri: 0, fibre: 2.3, proteine: 1.3, sale: 0 },
  { nome: "Ramen precotti in tazza (confezionati - solo pasta)", kcal: 440, grassi: 18.0, grassi_saturi: 8.5, carboidrati: 58.0, zuccheri: 2.5, fibre: 2.5, proteine: 9.5, sale: 3.50 },
  { nome: "Ravioli al branzino/pesce (confezionati)", kcal: 235, grassi: 6.5, grassi_saturi: 2.0, carboidrati: 32.0, zuccheri: 1.5, fibre: 2.0, proteine: 11.0, sale: 1.10 },
  { nome: "Ravioli ricotta e spinaci (confezionati)", kcal: 245, grassi: 7.0, grassi_saturi: 3.8, carboidrati: 34.0, zuccheri: 2.5, fibre: 3.0, proteine: 10.5, sale: 0.95 },
  { nome: "Babbi Cremadelizia (Cacao/Nocciola)", kcal: 545, grassi: 35.0, grassi_saturi: 9.0, carboidrati: 50.0, zuccheri: 48.0, fibre: 0, proteine: 8.0, sale: 0.10 },
  { nome: "Gallette di farro", kcal: 370, grassi: 2.5, grassi_saturi: 0.4, carboidrati: 72.0, zuccheri: 1.0, fibre: 7.0, proteine: 12.0, sale: 0.05 },
  { nome: "Gallette di grano saraceno", kcal: 380, grassi: 3.0, grassi_saturi: 0.6, carboidrati: 75.0, zuccheri: 0.8, fibre: 4.5, proteine: 11.5, sale: 0.02 },
  { nome: "Gallette di quinoa", kcal: 390, grassi: 5.5, grassi_saturi: 0.7, carboidrati: 70.0, zuccheri: 1.2, fibre: 6.0, proteine: 13.0, sale: 0.10 },
  { nome: "Gallette di legumi (lenticchie/piselli)", kcal: 345, grassi: 2.0, grassi_saturi: 0.3, carboidrati: 55.0, zuccheri: 2.0, fibre: 10.0, proteine: 22.0, sale: 0.80 },
  { nome: "Pani di segale croccanti (tipo Svedese)", kcal: 340, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 64.0, zuccheri: 1.5, fibre: 20.0, proteine: 9.5, sale: 1.25 },
  { nome: "Mini gallette di mais al formaggio", kcal: 465, grassi: 18.0, grassi_saturi: 2.5, carboidrati: 68.0, zuccheri: 3.0, fibre: 3.5, proteine: 7.0, sale: 2.20 },
  { nome: "Schiacciatine mantovane (secche)", kcal: 455, grassi: 16.0, grassi_saturi: 2.3, carboidrati: 66.0, zuccheri: 1.5, fibre: 2.5, proteine: 10.0, sale: 2.60 },
  { nome: "Bruschette chips (aglio e olio)", kcal: 480, grassi: 21.0, grassi_saturi: 3.0, carboidrati: 62.0, zuccheri: 3.5, fibre: 4.0, proteine: 8.5, sale: 2.10 },
  { nome: "Tarallini al peperoncino", kcal: 465, grassi: 20.0, grassi_saturi: 2.9, carboidrati: 60.0, zuccheri: 1.5, fibre: 3.0, proteine: 9.0, sale: 2.40 },
  { nome: "Tarallini ai semi di finocchio", kcal: 462, grassi: 19.5, grassi_saturi: 2.8, carboidrati: 61.0, zuccheri: 1.2, fibre: 3.2, proteine: 9.2, sale: 2.30 },
  { nome: "Tarallini integrali", kcal: 445, grassi: 18.0, grassi_saturi: 2.5, carboidrati: 56.0, zuccheri: 2.0, fibre: 8.0, proteine: 11.0, sale: 2.10 },
  { nome: "Pretzel / Brezel secchi", kcal: 380, grassi: 3.5, grassi_saturi: 1.5, carboidrati: 75.0, zuccheri: 2.5, fibre: 3.0, proteine: 10.0, sale: 3.50 },
  { nome: "Crostoni di pane per zuppa (fritti)", kcal: 520, grassi: 28.0, grassi_saturi: 4.5, carboidrati: 58.0, zuccheri: 2.5, fibre: 3.5, proteine: 7.5, sale: 2.00 },
  { nome: "Fette biscottate integrali", kcal: 375, grassi: 5.0, grassi_saturi: 1.2, carboidrati: 65.0, zuccheri: 6.5, fibre: 11.0, proteine: 12.5, sale: 1.20 },
  { nome: "Fette biscottate ai cereali", kcal: 395, grassi: 7.0, grassi_saturi: 1.5, carboidrati: 67.0, zuccheri: 7.5, fibre: 6.5, proteine: 12.0, sale: 1.30 },
  { nome: "Fette biscottate malto d'orzo", kcal: 405, grassi: 6.5, grassi_saturi: 2.8, carboidrati: 73.0, zuccheri: 9.0, fibre: 4.0, proteine: 11.0, sale: 1.15 },
  { nome: "Crostini dorati (confezionati)", kcal: 430, grassi: 12.0, grassi_saturi: 1.8, carboidrati: 68.0, zuccheri: 4.5, fibre: 4.0, proteine: 11.5, sale: 2.00 },
  { nome: "Pan fette senza glutine (tostato)", kcal: 390, grassi: 8.0, grassi_saturi: 1.2, carboidrati: 74.0, zuccheri: 5.0, fibre: 5.0, proteine: 3.5, sale: 1.60 },
  { nome: "Grissini al sesamo", kcal: 435, grassi: 13.0, grassi_saturi: 2.0, carboidrati: 64.0, zuccheri: 3.0, fibre: 4.5, proteine: 12.5, sale: 2.20 },
  { nome: "Grissini con farina di mais", kcal: 415, grassi: 9.0, grassi_saturi: 1.3, carboidrati: 72.0, zuccheri: 3.5, fibre: 3.5, proteine: 10.0, sale: 2.10 },
  { nome: "Grissini ricoperti di cioccolato", kcal: 510, grassi: 25.0, grassi_saturi: 14.0, carboidrati: 62.0, zuccheri: 35.0, fibre: 3.0, proteine: 7.5, sale: 0.60 },
  { nome: "Grissini al formaggio", kcal: 450, grassi: 16.0, grassi_saturi: 6.0, carboidrati: 61.0, zuccheri: 2.5, fibre: 2.5, proteine: 13.0, sale: 2.50 },
  { nome: "Cornflakes classici", kcal: 380, grassi: 0.9, grassi_saturi: 0.2, carboidrati: 84.0, zuccheri: 8.0, fibre: 3.0, proteine: 7.0, sale: 1.80 },
  { nome: "Cornflakes integrali", kcal: 365, grassi: 2.0, grassi_saturi: 0.4, carboidrati: 75.0, zuccheri: 6.0, fibre: 9.0, proteine: 8.5, sale: 1.20 },
  { nome: "Bastoncini di crusca di frumento", kcal: 335, grassi: 3.5, grassi_saturi: 0.6, carboidrati: 48.0, zuccheri: 14.0, fibre: 27.0, proteine: 14.0, sale: 0.90 },
  { nome: "Riso soffiato semplice", kcal: 385, grassi: 1.0, grassi_saturi: 0.2, carboidrati: 86.0, zuccheri: 0.5, fibre: 1.5, proteine: 7.5, sale: 0.02 },
  { nome: "Anellini di avena al miele", kcal: 395, grassi: 5.0, grassi_saturi: 1.0, carboidrati: 75.0, zuccheri: 25.0, fibre: 6.0, proteine: 9.0, sale: 1.00 },
  { nome: "Palline di riso e mais al cioccolato", kcal: 390, grassi: 4.0, grassi_saturi: 2.0, carboidrati: 78.0, zuccheri: 28.0, fibre: 4.5, proteine: 7.5, sale: 0.80 },
  { nome: "Muesli croccante (Granola) classico", kcal: 450, grassi: 16.0, grassi_saturi: 7.0, carboidrati: 63.0, zuccheri: 22.0, fibre: 7.0, proteine: 8.5, sale: 0.10 },
  { nome: "Muesli croccante al cioccolato", kcal: 470, grassi: 19.0, grassi_saturi: 9.0, carboidrati: 61.0, zuccheri: 25.0, fibre: 7.5, proteine: 9.0, sale: 0.15 },
  { nome: "Muesli classico con frutta secca", kcal: 370, grassi: 8.0, grassi_saturi: 1.5, carboidrati: 60.0, zuccheri: 18.0, fibre: 9.5, proteine: 10.0, sale: 0.05 },
  { nome: "Fiocchi d'avena integrali", kcal: 375, grassi: 7.0, grassi_saturi: 1.3, carboidrati: 59.0, zuccheri: 1.0, fibre: 10.0, proteine: 13.5, sale: 0.01 },
  { nome: "Fiocchi di farro", kcal: 345, grassi: 2.5, grassi_saturi: 0.4, carboidrati: 65.0, zuccheri: 1.5, fibre: 8.0, proteine: 12.0, sale: 0.01 },
  { nome: "Riso Arborio/Carnaroli", kcal: 345, grassi: 0.6, grassi_saturi: 0.1, carboidrati: 78.0, zuccheri: 0.3, fibre: 1.0, proteine: 7.0, sale: 0.01 },
  { nome: "Riso Basmati", kcal: 350, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 78.0, zuccheri: 0.2, fibre: 1.2, proteine: 8.5, sale: 0.01 },
  { nome: "Riso Integrale", kcal: 340, grassi: 2.5, grassi_saturi: 0.5, carboidrati: 70.0, zuccheri: 0.5, fibre: 4.5, proteine: 7.5, sale: 0.01 },
  { nome: "Riso Rosso", kcal: 355, grassi: 2.5, grassi_saturi: 0.5, carboidrati: 72.0, zuccheri: 0.8, fibre: 3.5, proteine: 8.0, sale: 0.01 },
  { nome: "Riso Venere (Nero)", kcal: 350, grassi: 2.2, grassi_saturi: 0.5, carboidrati: 70.0, zuccheri: 0.7, fibre: 4.0, proteine: 9.0, sale: 0.01 },
  { nome: "Riso Parboiled", kcal: 352, grassi: 0.8, grassi_saturi: 0.2, carboidrati: 79.0, zuccheri: 0.3, fibre: 1.5, proteine: 7.5, sale: 0.01 },
  { nome: "Quinoa (a crudo)", kcal: 368, grassi: 6.0, grassi_saturi: 0.7, carboidrati: 64.0, zuccheri: 1.5, fibre: 7.0, proteine: 14.0, sale: 0.01 },
  { nome: "Bulgur (Grano spezzato)", kcal: 342, grassi: 1.3, grassi_saturi: 0.2, carboidrati: 63.0, zuccheri: 0.4, fibre: 12.5, proteine: 12.0, sale: 0.01 },
  { nome: "Cous cous di semola (a crudo)", kcal: 355, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 71.0, zuccheri: 2.0, fibre: 3.5, proteine: 12.5, sale: 0.01 },
  { nome: "Cous cous integrale (a crudo)", kcal: 348, grassi: 2.2, grassi_saturi: 0.5, carboidrati: 64.0, zuccheri: 1.8, fibre: 8.5, proteine: 13.0, sale: 0.01 },
  { nome: "Miglio (a crudo)", kcal: 360, grassi: 3.9, grassi_saturi: 0.6, carboidrati: 69.0, zuccheri: 1.5, fibre: 3.5, proteine: 11.0, sale: 0.01 },
  { nome: "Orzo perlato (a crudo)", kcal: 350, grassi: 1.4, grassi_saturi: 0.3, carboidrati: 72.0, zuccheri: 0.8, fibre: 9.0, proteine: 10.0, sale: 0.01 },
  { nome: "Grano saraceno in chicchi", kcal: 343, grassi: 3.4, grassi_saturi: 0.7, carboidrati: 62.0, zuccheri: 0.0, fibre: 10.0, proteine: 13.0, sale: 0.01 },
  { nome: "Risotto alla milanese (busta)", kcal: 360, grassi: 3.5, grassi_saturi: 1.8, carboidrati: 72.0, zuccheri: 1.5, fibre: 1.2, proteine: 8.0, sale: 2.50 },
  { nome: "Paella surgelata (piatto pronto)", kcal: 145, grassi: 5.5, grassi_saturi: 1.2, carboidrati: 17.0, zuccheri: 1.5, fibre: 1.5, proteine: 6.5, sale: 1.10 },
  { nome: "Riso con verdure surgelato", kcal: 120, grassi: 2.5, grassi_saturi: 0.4, carboidrati: 20.0, zuccheri: 1.8, fibre: 2.2, proteine: 3.0, sale: 0.80 },
  { nome: "Riso Vialone Nano", kcal: 348, grassi: 0.6, grassi_saturi: 0.1, carboidrati: 78.0, zuccheri: 0.3, fibre: 1.0, proteine: 7.2, sale: 0.01 },
  { nome: "Riso Roma", kcal: 350, grassi: 0.6, grassi_saturi: 0.1, carboidrati: 79.0, zuccheri: 0.3, fibre: 1.0, proteine: 7.0, sale: 0.01 },
  { nome: "Riso Ribe", kcal: 352, grassi: 0.7, grassi_saturi: 0.1, carboidrati: 79.0, zuccheri: 0.3, fibre: 1.0, proteine: 7.0, sale: 0.01 },
  { nome: "Riso Originario", kcal: 345, grassi: 0.6, grassi_saturi: 0.1, carboidrati: 78.5, zuccheri: 0.3, fibre: 0.8, proteine: 6.8, sale: 0.01 },
  { nome: "Riso Thai Jasmine", kcal: 355, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 80.0, zuccheri: 0.2, fibre: 1.0, proteine: 7.5, sale: 0.01 },
  { nome: "Riso Integrale Selvaggio", kcal: 357, grassi: 1.1, grassi_saturi: 0.2, carboidrati: 72.0, zuccheri: 0.5, fibre: 6.0, proteine: 14.5, sale: 0.01 },
  { nome: "Riso Glutinoso", kcal: 365, grassi: 0.6, grassi_saturi: 0.1, carboidrati: 82.0, zuccheri: 0.1, fibre: 1.0, proteine: 6.5, sale: 0.01 },
  { nome: "Riso Sushi", kcal: 350, grassi: 0.6, grassi_saturi: 0.1, carboidrati: 78.0, zuccheri: 0.1, fibre: 1.0, proteine: 6.5, sale: 0.01 },
  { nome: "Riso Ermes (Rosso integrale)", kcal: 352, grassi: 2.3, grassi_saturi: 0.5, carboidrati: 72.0, zuccheri: 0.8, fibre: 3.8, proteine: 8.5, sale: 0.01 },
  { nome: "Riso Basmati cotto a vapore", kcal: 155, grassi: 2.5, grassi_saturi: 0.3, carboidrati: 29.0, zuccheri: 0.2, fibre: 1.2, proteine: 3.5, sale: 0.40 },
  { nome: "Riso integrale e Quinoa cotto", kcal: 165, grassi: 3.5, grassi_saturi: 0.5, carboidrati: 28.0, zuccheri: 0.5, fibre: 3.5, proteine: 4.5, sale: 0.50 },
  { nome: "Riso per insalate (precotto)", kcal: 350, grassi: 0.8, grassi_saturi: 0.2, carboidrati: 77.0, zuccheri: 0.5, fibre: 2.0, proteine: 7.5, sale: 0.01 },
  { nome: "Tagliatelle di riso integrale", kcal: 350, grassi: 2.8, grassi_saturi: 0.6, carboidrati: 72.0, zuccheri: 0.8, fibre: 4.0, proteine: 7.5, sale: 0.05 },
  { nome: "Vermicelli di riso", kcal: 355, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 81.0, zuccheri: 0.2, fibre: 1.0, proteine: 6.0, sale: 0.10 },
  { nome: "Penne di riso nero", kcal: 345, grassi: 2.2, grassi_saturi: 0.5, carboidrati: 71.0, zuccheri: 0.7, fibre: 4.5, proteine: 8.0, sale: 0.01 },
  { nome: "Mix 5 cereali", kcal: 350, grassi: 2.0, grassi_saturi: 0.4, carboidrati: 68.0, zuccheri: 1.2, fibre: 7.0, proteine: 11.5, sale: 0.01 },
  { nome: "Anellini di avena al miele", kcal: 395, grassi: 5.0, grassi_saturi: 1.0, carboidrati: 75.0, zuccheri: 25.0, fibre: 6.0, proteine: 9.0, sale: 1.00 },
  { nome: "Bastoncini di crusca di frumento", kcal: 335, grassi: 3.5, grassi_saturi: 0.6, carboidrati: 48.0, zuccheri: 14.0, fibre: 27.0, proteine: 14.0, sale: 0.90 },
  { nome: "Bruschette chips (aglio e olio)", kcal: 480, grassi: 21.0, grassi_saturi: 3.0, carboidrati: 62.0, zuccheri: 3.5, fibre: 4.0, proteine: 8.5, sale: 2.10 },
  { nome: "Bulgur (Grano spezzato)", kcal: 342, grassi: 1.3, grassi_saturi: 0.2, carboidrati: 63.0, zuccheri: 0.4, fibre: 12.5, proteine: 12.0, sale: 0.01 },
  { nome: "Cornflakes classici", kcal: 380, grassi: 0.9, grassi_saturi: 0.2, carboidrati: 84.0, zuccheri: 8.0, fibre: 3.0, proteine: 7.0, sale: 1.80 },
  { nome: "Cornflakes integrali", kcal: 365, grassi: 2.0, grassi_saturi: 0.4, carboidrati: 75.0, zuccheri: 6.0, fibre: 9.0, proteine: 8.5, sale: 1.20 },
  { nome: "Cous cous di semola (a crudo)", kcal: 355, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 71.0, zuccheri: 2.0, fibre: 3.5, proteine: 12.5, sale: 0.01 },
  { nome: "Cous cous integrale (a crudo)", kcal: 348, grassi: 2.2, grassi_saturi: 0.5, carboidrati: 64.0, zuccheri: 1.8, fibre: 8.5, proteine: 13.0, sale: 0.01 },
  { nome: "Crostini dorati (confezionati)", kcal: 430, grassi: 12.0, grassi_saturi: 1.8, carboidrati: 68.0, zuccheri: 4.5, fibre: 4.0, proteine: 11.5, sale: 2.00 },
  { nome: "Crostoni di pane per zuppa (fritti)", kcal: 520, grassi: 28.0, grassi_saturi: 4.5, carboidrati: 58.0, zuccheri: 2.5, fibre: 3.5, proteine: 7.5, sale: 2.00 },
  { nome: "Fette biscottate ai cereali", kcal: 395, grassi: 7.0, grassi_saturi: 1.5, carboidrati: 67.0, zuccheri: 7.5, fibre: 6.5, proteine: 12.0, sale: 1.30 },
  { nome: "Fette biscottate integrali", kcal: 375, grassi: 5.0, grassi_saturi: 1.2, carboidrati: 65.0, zuccheri: 6.5, fibre: 11.0, proteine: 12.5, sale: 1.20 },
  { nome: "Fette biscottate malto d'orzo", kcal: 405, grassi: 6.5, grassi_saturi: 2.8, carboidrati: 73.0, zuccheri: 9.0, fibre: 4.0, proteine: 11.0, sale: 1.15 },
  { nome: "Fiocchi d'avena integrali", kcal: 375, grassi: 7.0, grassi_saturi: 1.3, carboidrati: 59.0, zuccheri: 1.0, fibre: 10.0, proteine: 13.5, sale: 0.01 },
  { nome: "Fiocchi di farro", kcal: 345, grassi: 2.5, grassi_saturi: 0.4, carboidrati: 65.0, zuccheri: 1.5, fibre: 8.0, proteine: 12.0, sale: 0.01 },
  { nome: "Gallette di farro", kcal: 370, grassi: 2.5, grassi_saturi: 0.4, carboidrati: 72.0, zuccheri: 1.0, fibre: 7.0, proteine: 12.0, sale: 0.05 },
  { nome: "Gallette di grano saraceno", kcal: 380, grassi: 3.0, grassi_saturi: 0.6, carboidrati: 75.0, zuccheri: 0.8, fibre: 4.5, proteine: 11.5, sale: 0.02 },
  { nome: "Gallette di legumi (lenticchie/piselli)", kcal: 345, grassi: 2.0, grassi_saturi: 0.3, carboidrati: 55.0, zuccheri: 2.0, fibre: 10.0, proteine: 22.0, sale: 0.80 },
  { nome: "Gallette di quinoa", kcal: 390, grassi: 5.5, grassi_saturi: 0.7, carboidrati: 70.0, zuccheri: 1.2, fibre: 6.0, proteine: 13.0, sale: 0.10 },
  { nome: "Grano saraceno in chicchi", kcal: 343, grassi: 3.4, grassi_saturi: 0.7, carboidrati: 62.0, zuccheri: 0.0, fibre: 10.0, proteine: 13.0, sale: 0.01 },
  { nome: "Grissini al formaggio", kcal: 450, grassi: 16.0, grassi_saturi: 6.0, carboidrati: 61.0, zuccheri: 2.5, fibre: 2.5, proteine: 13.0, sale: 2.50 },
  { nome: "Grissini al sesamo", kcal: 435, grassi: 13.0, grassi_saturi: 2.0, carboidrati: 64.0, zuccheri: 3.0, fibre: 4.5, proteine: 12.5, sale: 2.20 },
  { nome: "Grissini con farina di mais", kcal: 415, grassi: 9.0, grassi_saturi: 1.3, carboidrati: 72.0, zuccheri: 3.5, fibre: 3.5, proteine: 10.0, sale: 2.10 },
  { nome: "Grissini ricoperti di cioccolato (snack)", kcal: 510, grassi: 25.0, grassi_saturi: 14.0, carboidrati: 62.0, zuccheri: 35.0, fibre: 3.0, proteine: 7.5, sale: 0.60 },
  { nome: "Miglio (a crudo)", kcal: 360, grassi: 3.9, grassi_saturi: 0.6, carboidrati: 69.0, zuccheri: 1.5, fibre: 3.5, proteine: 11.0, sale: 0.01 },
  { nome: "Mini gallette di mais al formaggio (snack)", kcal: 465, grassi: 18.0, grassi_saturi: 2.5, carboidrati: 68.0, zuccheri: 3.0, fibre: 3.5, proteine: 7.0, sale: 2.20 },
  { nome: "Mix 5 cereali", kcal: 350, grassi: 2.0, grassi_saturi: 0.4, carboidrati: 68.0, zuccheri: 1.2, fibre: 7.0, proteine: 11.5, sale: 0.01 },
  { nome: "Muesli classico con frutta secca", kcal: 370, grassi: 8.0, grassi_saturi: 1.5, carboidrati: 60.0, zuccheri: 18.0, fibre: 9.5, proteine: 10.0, sale: 0.05 },
  { nome: "Muesli croccante (Granola) classico", kcal: 450, grassi: 16.0, grassi_saturi: 7.0, carboidrati: 63.0, zuccheri: 22.0, fibre: 7.0, proteine: 8.5, sale: 0.10 },
  { nome: "Muesli croccante al cioccolato", kcal: 470, grassi: 19.0, grassi_saturi: 9.0, carboidrati: 61.0, zuccheri: 25.0, fibre: 7.5, proteine: 9.0, sale: 0.15 },
  { nome: "Orzo perlato (a crudo)", kcal: 350, grassi: 1.4, grassi_saturi: 0.3, carboidrati: 72.0, zuccheri: 0.8, fibre: 9.0, proteine: 10.0, sale: 0.01 },
  { nome: "Paella surgelata (piatto pronto)", kcal: 145, grassi: 5.5, grassi_saturi: 1.2, carboidrati: 17.0, zuccheri: 1.5, fibre: 1.5, proteine: 6.5, sale: 1.10 },
  { nome: "Palline di riso e mais al cioccolato", kcal: 390, grassi: 4.0, grassi_saturi: 2.0, carboidrati: 78.0, zuccheri: 28.0, fibre: 4.5, proteine: 7.5, sale: 0.80 },
  { nome: "Pan fette senza glutine (tostato)", kcal: 390, grassi: 8.0, grassi_saturi: 1.2, carboidrati: 74.0, zuccheri: 5.0, fibre: 5.0, proteine: 3.5, sale: 1.60 },
  { nome: "Pani di segale croccanti (tipo Svedese)", kcal: 340, grassi: 1.5, grassi_saturi: 0.3, carboidrati: 64.0, zuccheri: 1.5, fibre: 20.0, proteine: 9.5, sale: 1.25 },
  { nome: "Penne di riso nero", kcal: 345, grassi: 2.2, grassi_saturi: 0.5, carboidrati: 71.0, zuccheri: 0.7, fibre: 4.5, proteine: 8.0, sale: 0.01 },
  { nome: "Pretzel / Brezel secchi", kcal: 380, grassi: 3.5, grassi_saturi: 1.5, carboidrati: 75.0, zuccheri: 2.5, fibre: 3.0, proteine: 10.0, sale: 3.50 },
  { nome: "Quinoa (a crudo)", kcal: 368, grassi: 6.0, grassi_saturi: 0.7, carboidrati: 64.0, zuccheri: 1.5, fibre: 7.0, proteine: 14.0, sale: 0.01 },
  { nome: "Riso Arborio/Carnaroli", kcal: 345, grassi: 0.6, grassi_saturi: 0.1, carboidrati: 78.0, zuccheri: 0.3, fibre: 1.0, proteine: 7.0, sale: 0.01 },
  { nome: "Riso Basmati", kcal: 350, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 78.0, zuccheri: 0.2, fibre: 1.2, proteine: 8.5, sale: 0.01 },
  { nome: "Riso Basmati cotto a vapore", kcal: 155, grassi: 2.5, grassi_saturi: 0.3, carboidrati: 29.0, zuccheri: 0.2, fibre: 1.2, proteine: 3.5, sale: 0.40 },
  { nome: "Riso con verdure surgelato", kcal: 120, grassi: 2.5, grassi_saturi: 0.4, carboidrati: 20.0, zuccheri: 1.8, fibre: 2.2, proteine: 3.0, sale: 0.80 },
  { nome: "Riso Ermes (Rosso integrale)", kcal: 352, grassi: 2.3, grassi_saturi: 0.5, carboidrati: 72.0, zuccheri: 0.8, fibre: 3.8, proteine: 8.5, sale: 0.01 },
  { nome: "Riso Glutinoso", kcal: 365, grassi: 0.6, grassi_saturi: 0.1, carboidrati: 82.0, zuccheri: 0.1, fibre: 1.0, proteine: 6.5, sale: 0.01 },
  { nome: "Riso Integrale", kcal: 340, grassi: 2.5, grassi_saturi: 0.5, carboidrati: 70.0, zuccheri: 0.5, fibre: 4.5, proteine: 7.5, sale: 0.01 },
  { nome: "Riso integrale e Quinoa cotto", kcal: 165, grassi: 3.5, grassi_saturi: 0.5, carboidrati: 28.0, zuccheri: 0.5, fibre: 3.5, proteine: 4.5, sale: 0.50 },
  { nome: "Riso Integrale Selvaggio", kcal: 357, grassi: 1.1, grassi_saturi: 0.2, carboidrati: 72.0, zuccheri: 0.5, fibre: 6.0, proteine: 14.5, sale: 0.01 },
  { nome: "Riso Originario", kcal: 345, grassi: 0.6, grassi_saturi: 0.1, carboidrati: 78.5, zuccheri: 0.3, fibre: 0.8, proteine: 6.8, sale: 0.01 },
  { nome: "Riso Parboiled", kcal: 352, grassi: 0.8, grassi_saturi: 0.2, carboidrati: 79.0, zuccheri: 0.3, fibre: 1.5, proteine: 7.5, sale: 0.01 },
  { nome: "Riso per insalate (precotto)", kcal: 350, grassi: 0.8, grassi_saturi: 0.2, carboidrati: 77.0, zuccheri: 0.5, fibre: 2.0, proteine: 7.5, sale: 0.01 },
  { nome: "Riso Ribe", kcal: 352, grassi: 0.7, grassi_saturi: 0.1, carboidrati: 79.0, zuccheri: 0.3, fibre: 1.0, proteine: 7.0, sale: 0.01 },
  { nome: "Riso Roma", kcal: 350, grassi: 0.6, grassi_saturi: 0.1, carboidrati: 79.0, zuccheri: 0.3, fibre: 1.0, proteine: 7.0, sale: 0.01 },
  { nome: "Riso Rosso", kcal: 355, grassi: 2.5, grassi_saturi: 0.5, carboidrati: 72.0, zuccheri: 0.8, fibre: 3.5, proteine: 8.0, sale: 0.01 },
  { nome: "Riso soffiato semplice", kcal: 385, grassi: 1.0, grassi_saturi: 0.2, carboidrati: 86.0, zuccheri: 0.5, fibre: 1.5, proteine: 7.5, sale: 0.02 },
  { nome: "Riso Sushi", kcal: 350, grassi: 0.6, grassi_saturi: 0.1, carboidrati: 78.0, zuccheri: 0.1, fibre: 1.0, proteine: 6.5, sale: 0.01 },
  { nome: "Riso Thai Jasmine", kcal: 355, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 80.0, zuccheri: 0.2, fibre: 1.0, proteine: 7.5, sale: 0.01 },
  { nome: "Riso Venere (Nero)", kcal: 350, grassi: 2.2, grassi_saturi: 0.5, carboidrati: 70.0, zuccheri: 0.7, fibre: 4.0, proteine: 9.0, sale: 0.01 },
  { nome: "Riso Vialone Nano", kcal: 348, grassi: 0.6, grassi_saturi: 0.1, carboidrati: 78.0, zuccheri: 0.3, fibre: 1.0, proteine: 7.2, sale: 0.01 },
  { nome: "Risotto alla milanese (busta)", kcal: 360, grassi: 3.5, grassi_saturi: 1.8, carboidrati: 72.0, zuccheri: 1.5, fibre: 1.2, proteine: 8.0, sale: 2.50 },
  { nome: "Schiacciatine mantovane (secche)", kcal: 455, grassi: 16.0, grassi_saturi: 2.3, carboidrati: 66.0, zuccheri: 1.5, fibre: 2.5, proteine: 10.0, sale: 2.60 },
  { nome: "Tagliatelle di riso integrale", kcal: 350, grassi: 2.8, grassi_saturi: 0.6, carboidrati: 72.0, zuccheri: 0.8, fibre: 4.0, proteine: 7.5, sale: 0.05 },
  { nome: "Tarallini ai semi di finocchio", kcal: 462, grassi: 19.5, grassi_saturi: 2.8, carboidrati: 61.0, zuccheri: 1.2, fibre: 3.2, proteine: 9.2, sale: 2.30 },
  { nome: "Tarallini al peperoncino", kcal: 465, grassi: 20.0, grassi_saturi: 2.9, carboidrati: 60.0, zuccheri: 1.5, fibre: 3.0, proteine: 9.0, sale: 2.40 },
  { nome: "Tarallini integrali", kcal: 445, grassi: 18.0, grassi_saturi: 2.5, carboidrati: 56.0, zuccheri: 2.0, fibre: 8.0, proteine: 11.0, sale: 2.10 },
  { nome: "Vermicelli di riso", kcal: 355, grassi: 0.5, grassi_saturi: 0.1, carboidrati: 81.0, zuccheri: 0.2, fibre: 1.0, proteine: 6.0, sale: 0.10 },
  { nome: "Babbi Cremadelizia (Cacao/Nocciola)", kcal: 545, grassi: 35.0, grassi_saturi: 9.0, carboidrati: 50.0, zuccheri: 48.0, fibre: 0, proteine: 8.0, sale: 0.10 },
  { nome: "Asiago pressato", kcal: 310, grassi: 24.0, grassi_saturi: 16.0, carboidrati: 0.5, zuccheri: 0.5, fibre: 0, proteine: 23.0, sale: 1.70 },
  { nome: "Asiago SL (confezionato)", kcal: 305, grassi: 23.5, grassi_saturi: 15.5, carboidrati: 1.0, zuccheri: 1.0, fibre: 0, proteine: 22.5, sale: 1.75 },
  { nome: "Besciamella pronta (confezionata)", kcal: 160, grassi: 10.0, grassi_saturi: 6.5, carboidrati: 13.0, zuccheri: 4.5, fibre: 0.5, proteine: 4.5, sale: 0.80 },
  { nome: "Besciamella pronta SL (confezionata)", kcal: 155, grassi: 9.5, grassi_saturi: 6.0, carboidrati: 14.0, zuccheri: 5.0, fibre: 0.5, proteine: 4.2, sale: 0.85 },
  { nome: "Bevanda proteica al latte (Milkshake) (confezionata)", kcal: 60, grassi: 0.8, grassi_saturi: 0.5, carboidrati: 5.0, zuccheri: 4.8, fibre: 0, proteine: 8.0, sale: 0.10 },
  { nome: "Bevanda proteica al latte SL (confezionata)", kcal: 60, grassi: 0.8, grassi_saturi: 0.5, carboidrati: 5.2, zuccheri: 5.0, fibre: 0, proteine: 8.0, sale: 0.11 },
  { nome: "Bitto DOP (formaggio valtellinese)", kcal: 395, grassi: 32.0, grassi_saturi: 22.0, carboidrati: 0.5, zuccheri: 0, fibre: 0, proteine: 26.0, sale: 1.80 },
  { nome: "Bitto SL (confezionato)", kcal: 390, grassi: 31.5, grassi_saturi: 21.5, carboidrati: 1.0, zuccheri: 0.5, fibre: 0, proteine: 25.5, sale: 1.85 },
  { nome: "Bra DOP (Tenero)", kcal: 345, grassi: 27.0, grassi_saturi: 18.0, carboidrati: 0.8, zuccheri: 0.5, fibre: 0, proteine: 24.0, sale: 1.60 },
  { nome: "Bra Duro DOP", kcal: 375, grassi: 29.0, grassi_saturi: 20.0, carboidrati: 0, zuccheri: 0, fibre: 0, proteine: 28.0, sale: 2.20 },
  { nome: "Bra SL (confezionato)", kcal: 340, grassi: 26.5, grassi_saturi: 17.5, carboidrati: 1.2, zuccheri: 1.0, fibre: 0, proteine: 23.5, sale: 1.65 },
  { nome: "Brie SL (confezionato)", kcal: 285, grassi: 23.5, grassi_saturi: 16.0, carboidrati: 1.0, zuccheri: 1.0, fibre: 0, proteine: 17.5, sale: 1.65 },
  { nome: "Budino al cioccolato (confezionato)", kcal: 130, grassi: 3.5, grassi_saturi: 2.3, carboidrati: 21.0, zuccheri: 18.0, fibre: 0.8, proteine: 3.5, sale: 0.15 },
  { nome: "Budino al cioccolato SL (confezionato)", kcal: 125, grassi: 3.2, grassi_saturi: 2.1, carboidrati: 22.0, zuccheri: 19.0, fibre: 0.8, proteine: 3.3, sale: 0.16 },
  { nome: "Budino alla vaniglia (confezionato)", kcal: 115, grassi: 3.0, grassi_saturi: 2.0, carboidrati: 19.0, zuccheri: 16.0, fibre: 0, proteine: 3.2, sale: 0.14 },
  { nome: "Budino alla vaniglia SL (confezionato)", kcal: 112, grassi: 2.8, grassi_saturi: 1.8, carboidrati: 20.0, zuccheri: 17.5, fibre: 0, proteine: 3.0, sale: 0.15 },
  { nome: "Budino proteico al caramello SL (confezionato)", kcal: 78, grassi: 1.4, grassi_saturi: 0.9, carboidrati: 6.0, zuccheri: 4.2, fibre: 0, proteine: 10.0, sale: 0.15 },
  { nome: "Budino proteico al cioccolato (confezionato)", kcal: 80, grassi: 1.5, grassi_saturi: 1.0, carboidrati: 6.0, zuccheri: 4.5, fibre: 0.5, proteine: 10.0, sale: 0.15 },
  { nome: "Budino proteico al cioccolato SL (confezionato)", kcal: 80, grassi: 1.5, grassi_saturi: 1.0, carboidrati: 6.5, zuccheri: 4.8, fibre: 0.5, proteine: 10.0, sale: 0.15 },
  { nome: "Budino proteico alla vaniglia (confezionato)", kcal: 75, grassi: 1.2, grassi_saturi: 0.8, carboidrati: 5.5, zuccheri: 4.0, fibre: 0, proteine: 10.0, sale: 0.14 },
  { nome: "Burrata (confezionata)", kcal: 260, grassi: 23.0, grassi_saturi: 15.5, carboidrati: 2.0, zuccheri: 1.8, fibre: 0, proteine: 11.5, sale: 0.60 },
  { nome: "Burrata SL (confezionata)", kcal: 255, grassi: 22.5, grassi_saturi: 15.0, carboidrati: 2.5, zuccheri: 2.2, fibre: 0, proteine: 11.0, sale: 0.65 },
  { nome: "Burro chiarificato (Ghee) (confezionato)", kcal: 895, grassi: 99.5, grassi_saturi: 65.0, carboidrati: 0, zuccheri: 0, fibre: 0, proteine: 0, sale: 0.01 },
  { nome: "Burro Light (a ridotto contenuto di grassi)", kcal: 380, grassi: 40.0, grassi_saturi: 26.0, carboidrati: 2.5, zuccheri: 2.5, fibre: 0, proteine: 2.0, sale: 0.10 },
  { nome: "Burro SL (confezionato)", kcal: 717, grassi: 80.0, grassi_saturi: 52.0, carboidrati: 0.7, zuccheri: 0.7, fibre: 0, proteine: 0.6, sale: 0.02 },
  { nome: "Burro tradizionale (confezionato)", kcal: 717, grassi: 80.0, grassi_saturi: 52.0, carboidrati: 0.6, zuccheri: 0.6, fibre: 0, proteine: 0.6, sale: 0.02 },
  { nome: "Caciocavallo Silano DOP", kcal: 438, grassi: 34.0, grassi_saturi: 22.0, carboidrati: 1.5, zuccheri: 1.0, fibre: 0, proteine: 31.0, sale: 2.00 },
  { nome: "Caciocavallo SL (confezionato)", kcal: 432, grassi: 33.5, grassi_saturi: 21.5, carboidrati: 2.0, zuccheri: 1.5, fibre: 0, proteine: 30.5, sale: 2.10 },
  { nome: "Cacioricotta", kcal: 280, grassi: 22.0, grassi_saturi: 15.0, carboidrati: 3.5, zuccheri: 3.5, fibre: 0, proteine: 17.0, sale: 2.50 },
  { nome: "Cacioricotta SL (confezionata)", kcal: 275, grassi: 21.5, grassi_saturi: 14.5, carboidrati: 4.0, zuccheri: 4.0, fibre: 0, proteine: 16.5, sale: 2.60 },
  { nome: "Caciotta SL (confezionata)", kcal: 260, grassi: 20.5, grassi_saturi: 14.0, carboidrati: 1.5, zuccheri: 1.5, fibre: 0, proteine: 17.5, sale: 1.15 },
  { nome: "Caciotta vaccina (confezionata)", kcal: 265, grassi: 21.0, grassi_saturi: 14.5, carboidrati: 1.0, zuccheri: 1.0, fibre: 0, proteine: 18.0, sale: 1.10 },
  { nome: "Caciotta di Capra SL (confezionata)", kcal: 392, grassi: 31.5, grassi_saturi: 21.5, carboidrati: 1.4, zuccheri: 1.0, fibre: 0, proteine: 25.5, sale: 1.65 },
  { nome: "Caciotta di Capra stagionata", kcal: 398, grassi: 32.0, grassi_saturi: 22.0, carboidrati: 0.9, zuccheri: 0.5, fibre: 0, proteine: 26.0, sale: 1.60 },
  { nome: "Camembert / Brie (confezionato)", kcal: 290, grassi: 24.0, grassi_saturi: 16.5, carboidrati: 0.5, zuccheri: 0.5, fibre: 0, proteine: 18.0, sale: 1.60 },
  { nome: "Caprino fresco (vaccino/caprino)", kcal: 240, grassi: 20.0, grassi_saturi: 14.0, carboidrati: 2.5, zuccheri: 2.5, fibre: 0, proteine: 12.5, sale: 0.80 },
  { nome: "Caprino fresco SL (confezionato)", kcal: 235, grassi: 19.5, grassi_saturi: 13.5, carboidrati: 3.0, zuccheri: 3.0, fibre: 0, proteine: 12.0, sale: 0.85 },
  { nome: "Casatella SL (confezionata)", kcal: 242, grassi: 19.5, grassi_saturi: 13.5, carboidrati: 3.2, zuccheri: 3.2, fibre: 0, proteine: 13.5, sale: 0.85 },
  { nome: "Casatella Trevigiana DOP", kcal: 246, grassi: 20.0, grassi_saturi: 14.0, carboidrati: 2.8, zuccheri: 2.8, fibre: 0, proteine: 14.0, sale: 0.80 },
  { nome: "Castelmagno DOP", kcal: 380, grassi: 30.0, grassi_saturi: 21.0, carboidrati: 0.5, zuccheri: 0.1, fibre: 0, proteine: 24.0, sale: 2.00 },
  { nome: "Cheddar (confezionato)", kcal: 400, grassi: 33.0, grassi_saturi: 21.0, carboidrati: 0.1, zuccheri: 0.1, fibre: 0, proteine: 25.0, sale: 1.80 },
  { nome: "Cheddar SL (confezionato)", kcal: 395, grassi: 32.5, grassi_saturi: 20.5, carboidrati: 0.5, zuccheri: 0.5, fibre: 0, proteine: 24.5, sale: 1.85 },
  { nome: "Edamer (confezionato)", kcal: 310, grassi: 24.0, grassi_saturi: 15.5, carboidrati: 0.1, zuccheri: 0.1, fibre: 0, proteine: 24.0, sale: 1.80 },
  { nome: "Edamer SL (confezionato)", kcal: 308, grassi: 23.5, grassi_saturi: 15.0, carboidrati: 0.5, zuccheri: 0.5, fibre: 0, proteine: 23.5, sale: 1.85 },
  { nome: "Emmental (confezionato)", kcal: 370, grassi: 30.0, grassi_saturi: 19.0, carboidrati: 0.1, zuccheri: 0.1, fibre: 0, proteine: 27.0, sale: 0.50 },
  { nome: "Emmental SL (confezionato)", kcal: 368, grassi: 29.5, grassi_saturi: 18.5, carboidrati: 0.5, zuccheri: 0.5, fibre: 0, proteine: 26.5, sale: 0.55 },
  { nome: "Feta Greca (confezionata)", kcal: 275, grassi: 23.0, grassi_saturi: 16.0, carboidrati: 1.0, zuccheri: 0.5, fibre: 0, proteine: 16.5, sale: 2.50 },
  { nome: "Feta Greca SL (confezionata)", kcal: 270, grassi: 22.5, grassi_saturi: 15.5, carboidrati: 1.5, zuccheri: 1.0, fibre: 0, proteine: 16.0, sale: 2.60 },
  { nome: "Fiocchi di latte (Cottage cheese)", kcal: 95, grassi: 4.5, grassi_saturi: 3.0, carboidrati: 3.0, zuccheri: 2.5, fibre: 0, proteine: 11.0, sale: 0.75 },
  { nome: "Fiocchi di latte SL (confezionata)", kcal: 92, grassi: 4.3, grassi_saturi: 2.8, carboidrati: 3.2, zuccheri: 3.2, fibre: 0, proteine: 10.5, sale: 0.80 },
  { nome: "Fiocchi di latte alle verdure", kcal: 95, grassi: 4.2, grassi_saturi: 2.8, carboidrati: 3.0, zuccheri: 3.0, fibre: 0.5, proteine: 10.9, sale: 0.80 },
  { nome: "Fiocchi di latte alle verdure SL", kcal: 92, grassi: 4.0, grassi_saturi: 2.5, carboidrati: 3.5, zuccheri: 3.5, fibre: 0.5, proteine: 10.5, sale: 0.85 },
  { nome: "Fontal (confezionato)", kcal: 340, grassi: 26.0, grassi_saturi: 18.0, carboidrati: 0.5, zuccheri: 0.5, fibre: 0, proteine: 24.0, sale: 1.60 },
  { nome: "Fontal SL (confezionato)", kcal: 335, grassi: 25.5, grassi_saturi: 17.5, carboidrati: 1.0, zuccheri: 1.0, fibre: 0, proteine: 23.5, sale: 1.65 },
  { nome: "Fontina DOP", kcal: 345, grassi: 27.0, grassi_saturi: 18.0, carboidrati: 0.5, zuccheri: 0.5, fibre: 0, proteine: 25.0, sale: 1.90 },
  { nome: "Formaggino classico (confezionato)", kcal: 230, grassi: 17.0, grassi_saturi: 11.0, carboidrati: 6.0, zuccheri: 6.0, fibre: 0, proteine: 13.0, sale: 2.20 },
  { nome: "Formaggino SL (confezionato)", kcal: 225, grassi: 16.5, grassi_saturi: 10.5, carboidrati: 7.0, zuccheri: 7.0, fibre: 0, proteine: 12.5, sale: 2.30 },
  { nome: "Formaggio spalmabile classico", kcal: 240, grassi: 22.0, grassi_saturi: 14.5, carboidrati: 4.5, zuccheri: 4.0, fibre: 0, proteine: 5.5, sale: 0.75 },
  { nome: "Formaggio spalmabile Light", kcal: 155, grassi: 11.0, grassi_saturi: 7.5, carboidrati: 6.0, zuccheri: 5.5, fibre: 0, proteine: 8.0, sale: 0.85 },
  { nome: "Formaggio spalmabile Light SL", kcal: 150, grassi: 10.5, grassi_saturi: 7.0, carboidrati: 6.5, zuccheri: 6.0, fibre: 0, proteine: 7.5, sale: 0.90 },
  { nome: "Formaggio spalmabile SL (confezionata)", kcal: 235, grassi: 21.5, grassi_saturi: 14.0, carboidrati: 5.0, zuccheri: 4.5, fibre: 0, proteine: 5.2, sale: 0.80 },
  { nome: "Formaggio spalmabile alle erbe", kcal: 235, grassi: 21.5, grassi_saturi: 14.5, carboidrati: 4.0, zuccheri: 3.5, fibre: 0.5, proteine: 5.5, sale: 1.10 },
  { nome: "Formaggio spalmabile alle erbe SL", kcal: 230, grassi: 21.0, grassi_saturi: 14.0, carboidrati: 4.5, zuccheri: 4.0, fibre: 0.5, proteine: 5.2, sale: 1.15 },
  { nome: "Giuncata (fresca)", kcal: 180, grassi: 14.0, grassi_saturi: 9.5, carboidrati: 3.0, zuccheri: 3.0, fibre: 0, proteine: 11.0, sale: 0.60 },
  { nome: "Gorgonzola Dolce", kcal: 320, grassi: 27.0, grassi_saturi: 18.5, carboidrati: 0.5, zuccheri: 0.5, fibre: 0, proteine: 19.0, sale: 1.80 },
  { nome: "Gorgonzola SL (certificato)", kcal: 315, grassi: 26.5, grassi_saturi: 18.0, carboidrati: 0.8, zuccheri: 0.8, fibre: 0, proteine: 18.5, sale: 1.85 },
  { nome: "Gouda (confezionato)", kcal: 350, grassi: 27.0, grassi_saturi: 18.0, carboidrati: 0.1, zuccheri: 0.1, fibre: 0, proteine: 25.0, sale: 1.90 },
  { nome: "Gouda SL (confezionato)", kcal: 345, grassi: 26.5, grassi_saturi: 17.5, carboidrati: 0.5, zuccheri: 0.5, fibre: 0, proteine: 24.5, sale: 1.95 },
  { nome: "Grana Padano", kcal: 398, grassi: 29.0, grassi_saturi: 18.5, carboidrati: 0, zuccheri: 0, fibre: 0, proteine: 33.0, sale: 1.50 },
  { nome: "Halloumi (da griglia)", kcal: 320, grassi: 24.0, grassi_saturi: 16.0, carboidrati: 2.0, zuccheri: 2.0, fibre: 0, proteine: 22.0, sale: 2.80 },
  { nome: "Halloumi SL (confezionato)", kcal: 315, grassi: 23.5, grassi_saturi: 15.5, carboidrati: 2.5, zuccheri: 2.5, fibre: 0, proteine: 21.5, sale: 2.90 },
  { nome: "Kefir (confezionato)", kcal: 50, grassi: 2.0, grassi_saturi: 1.3, carboidrati: 4.0, zuccheri: 4.0, fibre: 0, proteine: 3.5, sale: 0.10 },
  { nome: "Kefir SL (confezionato)", kcal: 50, grassi: 2.0, grassi_saturi: 1.3, carboidrati: 4.5, zuccheri: 4.5, fibre: 0, proteine: 3.5, sale: 0.11 },
  { nome: "Kefir alla fragola SL", kcal: 85, grassi: 1.5, grassi_saturi: 1.0, carboidrati: 14.0, zuccheri: 13.5, fibre: 0.2, proteine: 3.0, sale: 0.11 },
  { nome: "Kefir aromatizzato alla fragola", kcal: 85, grassi: 1.5, grassi_saturi: 1.0, carboidrati: 13.0, zuccheri: 12.5, fibre: 0.2, proteine: 3.2, sale: 0.10 },
  { nome: "Labneh (formaggio di yogurt)", kcal: 160, grassi: 12.0, grassi_saturi: 8.0, carboidrati: 4.5, zuccheri: 4.0, fibre: 0, proteine: 8.5, sale: 0.80 },
  { nome: "Latte condensato SL", kcal: 315, grassi: 8.0, grassi_saturi: 5.5, carboidrati: 56.0, zuccheri: 56.0, fibre: 0, proteine: 7.2, sale: 0.26 },
  { nome: "Latte condensato zuccherato", kcal: 320, grassi: 8.0, grassi_saturi: 5.5, carboidrati: 55.0, zuccheri: 55.0, fibre: 0, proteine: 7.5, sale: 0.25 },
  { nome: "Latte di capra intero", kcal: 69, grassi: 4.1, grassi_saturi: 2.7, carboidrati: 4.5, zuccheri: 4.5, fibre: 0, proteine: 3.5, sale: 0.12 },
  { nome: "Latte di capra parzialmente scremato", kcal: 48, grassi: 1.8, grassi_saturi: 1.2, carboidrati: 4.6, zuccheri: 4.6, fibre: 0, proteine: 3.4, sale: 0.12 },
  { nome: "Latte di pecora", kcal: 108, grassi: 7.0, grassi_saturi: 4.8, carboidrati: 5.4, zuccheri: 5.4, fibre: 0, proteine: 6.0, sale: 0.15 },
  { nome: "Latte evaporato (non zuccherato)", kcal: 135, grassi: 7.5, grassi_saturi: 5.0, carboidrati: 10.0, zuccheri: 10.0, fibre: 0, proteine: 7.0, sale: 0.20 },
  { nome: "Latte intero (confezionato)", kcal: 64, grassi: 3.6, grassi_saturi: 2.3, carboidrati: 4.8, zuccheri: 4.8, fibre: 0, proteine: 3.3, sale: 0.10 },
  { nome: "Latte intero SL (confezionato)", kcal: 64, grassi: 3.6, grassi_saturi: 2.3, carboidrati: 4.9, zuccheri: 4.9, fibre: 0, proteine: 3.3, sale: 0.10 },
  { nome: "Latte parzialmente scremato", kcal: 46, grassi: 1.6, grassi_saturi: 1.0, carboidrati: 4.9, zuccheri: 4.9, fibre: 0, proteine: 3.4, sale: 0.10 },
  { nome: "Latte parzialmente scremato SL", kcal: 46, grassi: 1.6, grassi_saturi: 1.0, carboidrati: 5.0, zuccheri: 5.0, fibre: 0, proteine: 3.4, sale: 0.10 },
  { nome: "Latte scremato (confezionato)", kcal: 34, grassi: 0.2, grassi_saturi: 0.1, carboidrati: 5.0, zuccheri: 5.0, fibre: 0, proteine: 3.5, sale: 0.11 },
  { nome: "Latte scremato SL (confezionato)", kcal: 34, grassi: 0.2, grassi_saturi: 0.1, carboidrati: 5.1, zuccheri: 5.1, fibre: 0, proteine: 3.5, sale: 0.11 },
  { nome: "Le Gruyère (Groviera svizzera)", kcal: 413, grassi: 32.3, grassi_saturi: 19.0, carboidrati: 0.4, zuccheri: 0.1, fibre: 0, proteine: 29.8, sale: 1.50 },
  { nome: "Le Gruyère SL (confezionato)", kcal: 410, grassi: 32.0, grassi_saturi: 18.5, carboidrati: 0.8, zuccheri: 0.5, fibre: 0, proteine: 29.0, sale: 1.55 },
  { nome: "Leerdammer / Formaggio a fette Light", kcal: 270, grassi: 17.0, grassi_saturi: 11.5, carboidrati: 0.1, zuccheri: 0.1, fibre: 0, proteine: 29.0, sale: 1.50 },
  { nome: "Manchego (pecora spagnolo)", kcal: 420, grassi: 35.5, grassi_saturi: 23.5, carboidrati: 1.0, zuccheri: 0.5, fibre: 0, proteine: 24.0, sale: 1.80 },
  { nome: "Mascarpone (confezionato)", kcal: 445, grassi: 47.0, grassi_saturi: 32.0, carboidrati: 3.0, zuccheri: 3.0, fibre: 0, proteine: 4.5, sale: 0.10 },
  { nome: "Mascarpone SL (confezionato)", kcal: 440, grassi: 46.5, grassi_saturi: 31.5, carboidrati: 3.5, zuccheri: 3.5, fibre: 0, proteine: 4.2, sale: 0.11 },
  { nome: "Montasio DOP", kcal: 370, grassi: 30.0, grassi_saturi: 20.0, carboidrati: 0.5, zuccheri: 0, fibre: 0, proteine: 25.0, sale: 1.70 },
  { nome: "Mousse al latte (confezionata)", kcal: 160, grassi: 10.0, grassi_saturi: 7.0, carboidrati: 14.0, zuccheri: 13.0, fibre: 0, proteine: 3.8, sale: 0.12 },
  { nome: "Mousse al latte SL (confezionata)", kcal: 158, grassi: 9.8, grassi_saturi: 6.8, carboidrati: 15.0, zuccheri: 14.5, fibre: 0, proteine: 3.5, sale: 0.13 },
  { nome: "Mousse di formaggio fresco", kcal: 250, grassi: 23.0, grassi_saturi: 16.0, carboidrati: 3.5, zuccheri: 3.5, fibre: 0, proteine: 6.5, sale: 0.90 },
  { nome: "Mousse di formaggio fresco Light", kcal: 140, grassi: 8.0, grassi_saturi: 5.5, carboidrati: 6.5, zuccheri: 6.0, fibre: 0, proteine: 9.5, sale: 0.80 },
  { nome: "Mousse di formaggio fresco Light SL", kcal: 135, grassi: 7.5, grassi_saturi: 5.0, carboidrati: 7.0, zuccheri: 6.5, fibre: 0, proteine: 9.0, sale: 0.85 },
  { nome: "Mozzarella Light (confezionata)", kcal: 165, grassi: 9.0, grassi_saturi: 6.0, carboidrati: 1.5, zuccheri: 1.0, fibre: 0, proteine: 19.5, sale: 0.80 },
  { nome: "Mozzarella Light SL (confezionata)", kcal: 162, grassi: 8.8, grassi_saturi: 5.8, carboidrati: 1.8, zuccheri: 1.2, fibre: 0, proteine: 19.0, sale: 0.85 },
  { nome: "Mozzarella di Bufala Campana DOP", kcal: 288, grassi: 24.5, grassi_saturi: 17.0, carboidrati: 0.7, zuccheri: 0.7, fibre: 0, proteine: 16.5, sale: 0.60 },
  { nome: "Mozzarella di Bufala SL", kcal: 285, grassi: 24.0, grassi_saturi: 16.8, carboidrati: 1.0, zuccheri: 1.0, fibre: 0, proteine: 16.2, sale: 0.65 },
  { nome: "Mozzarella di vacca (confezionata)", kcal: 250, grassi: 18.0, grassi_saturi: 12.5, carboidrati: 1.5, zuccheri: 1.2, fibre: 0, proteine: 20.0, sale: 0.70 },
  { nome: "Mozzarella di vacca SL (confezionata)", kcal: 245, grassi: 18.0, grassi_saturi: 12.5, carboidrati: 1.0, zuccheri: 0.8, fibre: 0, proteine: 19.5, sale: 0.70 },
  { nome: "Panna da cucina (confezionata)", kcal: 220, grassi: 21.5, grassi_saturi: 14.0, carboidrati: 3.8, zuccheri: 3.5, fibre: 0, proteine: 3.0, sale: 0.10 },
  { nome: "Panna da cucina SL (confezionata)", kcal: 218, grassi: 21.5, grassi_saturi: 14.0, carboidrati: 4.0, zuccheri: 4.0, fibre: 0, proteine: 3.0, sale: 0.10 },
  { nome: "Panna spray (confezionata)", kcal: 260, grassi: 25.0, grassi_saturi: 17.0, carboidrati: 7.0, zuccheri: 7.0, fibre: 0, proteine: 2.2, sale: 0.10 },
  { nome: "Panna spray SL (confezionata)", kcal: 255, grassi: 24.5, grassi_saturi: 16.5, carboidrati: 8.0, zuccheri: 8.0, fibre: 0, proteine: 2.0, sale: 0.10 },
  { nome: "Parmigiano Reggiano 24 mesi", kcal: 402, grassi: 30.0, grassi_saturi: 20.0, carboidrati: 0, zuccheri: 0, fibre: 0, proteine: 32.0, sale: 1.60 },
  { nome: "Pecorino Romano", kcal: 390, grassi: 32.0, grassi_saturi: 18.0, carboidrati: 0.5, zuccheri: 0, fibre: 0, proteine: 25.0, sale: 4.50 },
  { nome: "Pecorino SL (confezionato)", kcal: 385, grassi: 31.5, grassi_saturi: 17.5, carboidrati: 0.8, zuccheri: 0.5, fibre: 0, proteine: 24.5, sale: 4.20 },
  { nome: "Piave DOP (Vecchio)", kcal: 450, grassi: 35.0, grassi_saturi: 24.0, carboidrati: 0, zuccheri: 0, fibre: 0, proteine: 33.0, sale: 1.90 },
  { nome: "Piave SL (confezionato)", kcal: 445, grassi: 34.5, grassi_saturi: 23.5, carboidrati: 0.5, zuccheri: 0.5, fibre: 0, proteine: 32.5, sale: 1.95 },
  { nome: "Primo Sale (confezionato)", kcal: 245, grassi: 19.0, grassi_saturi: 13.0, carboidrati: 2.0, zuccheri: 2.0, fibre: 0, proteine: 16.5, sale: 1.30 },
  { nome: "Primo Sale SL (confezionato)", kcal: 240, grassi: 18.5, grassi_saturi: 12.5, carboidrati: 2.5, zuccheri: 2.5, fibre: 0, proteine: 16.0, sale: 1.35 },
  { nome: "Provolone Dolce (confezionato)", kcal: 365, grassi: 28.5, grassi_saturi: 19.0, carboidrati: 1.5, zuccheri: 0.5, fibre: 0, proteine: 25.5, sale: 2.00 },
  { nome: "Provolone Dolce SL (confezionato)", kcal: 360, grassi: 28.0, grassi_saturi: 18.5, carboidrati: 2.0, zuccheri: 1.0, fibre: 0, proteine: 25.0, sale: 2.10 },
  { nome: "Provolone Piccante", kcal: 375, grassi: 30.0, grassi_saturi: 20.0, carboidrati: 0.5, zuccheri: 0.1, fibre: 0, proteine: 26.0, sale: 2.50 },
  { nome: "Puzzone di Moena", kcal: 350, grassi: 28.0, grassi_saturi: 19.0, carboidrati: 0.5, zuccheri: 0.5, fibre: 0, proteine: 24.5, sale: 1.90 },
  { nome: "Caciotta di Capra SL (confezionata)", kcal: 392, grassi: 31.5, grassi_saturi: 21.5, carboidrati: 1.4, zuccheri: 1.0, fibre: 0, proteine: 25.5, sale: 1.65 },
  { nome: "Caciotta di Capra stagionata", kcal: 398, grassi: 32.0, grassi_saturi: 22.0, carboidrati: 0.9, zuccheri: 0.5, fibre: 0, proteine: 26.0, sale: 1.60 },
  { nome: "Cacioricotta", kcal: 280, grassi: 22.0, grassi_saturi: 15.0, carboidrati: 3.5, zuccheri: 3.5, fibre: 0, proteine: 17.0, sale: 2.50 },
  { nome: "Cacioricotta SL (confezionata)", kcal: 275, grassi: 21.5, grassi_saturi: 14.5, carboidrati: 4.0, zuccheri: 4.0, fibre: 0, proteine: 16.5, sale: 2.60 },
  { nome: "Fiocchi di latte alle verdure", kcal: 95, grassi: 4.2, grassi_saturi: 2.8, carboidrati: 3.0, zuccheri: 3.0, fibre: 0.5, proteine: 10.9, sale: 0.80 },
  { nome: "Fiocchi di latte alle verdure SL (confezionati)", kcal: 92, grassi: 4.0, grassi_saturi: 2.5, carboidrati: 3.5, zuccheri: 3.5, fibre: 0.5, proteine: 10.5, sale: 0.85 },
  { nome: "Gallette di farro", kcal: 370, grassi: 2.5, grassi_saturi: 0.4, carboidrati: 72.0, zuccheri: 1.0, fibre: 7.0, proteine: 12.0, sale: 0.05 },
];

let profilo = JSON.parse(localStorage.getItem('nv_profilo')) || null;
let diario = JSON.parse(localStorage.getItem('nv_diario')) || [];
let acqua = parseInt(localStorage.getItem('nv_acqua')) || 0;
let ciboSelezionato = null;
let tempRecipe = { items: [], k: 0, p: 0, c: 0, g: 0, fe: 0, ca: 0, b12: 0 };

// 2. STATO DEL DIARIO/CALENDARIO
let log = JSON.parse(localStorage.getItem('nv_log')) || {};
let ricetteSalvate = JSON.parse(localStorage.getItem('nv_ricette')) || [];
let activeDate = new Date().toISOString().split('T')[0];
let currentMonth = new Date();
let currentMealType = 'Colazione';
let aiSelectedIngredients = [];

let wizardCurrentStep = 1;
const wizardTotalSteps = 12;
let userProfile = {};

const isFirstAccess = () => localStorage.getItem('isFirstAccess') !== 'false';
const setFirstAccess = (val) => localStorage.setItem('isFirstAccess', val ? 'true' : 'false');

function initApp(profile) {
    profilo = profile;
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    mostraSezione('home');
    aggiornaUI();
    aggiornaListaRicetteSalvate();
}

window.onload = () => {
    const storedProfile = JSON.parse(localStorage.getItem('nv_profilo'));
    if (!storedProfile || isFirstAccess()) {
        document.getElementById('setup-screen').style.display = 'block';
        document.getElementById('main-app').style.display = 'none';
        showWizardStep(wizardCurrentStep);
        setFirstAccess(false);
        return;
    }

    initApp(storedProfile);
};

function salvaProfilo() {
    finalizzaProfilo();
}

function initWizard() {
    wizardCurrentStep = 1;
    showWizardStep(wizardCurrentStep);
    document.getElementById('setup-screen').style.display = 'block';
    document.getElementById('main-app').style.display = 'none';
}

function showWizardStep(step) {
    document.querySelectorAll('.wizard-step').forEach(s => {
        s.classList.remove('active');
    });

    const current = document.querySelector(`.wizard-step[data-step='${step}']`);
    if (current) {
        current.classList.add('active');
    }

    const progress = document.getElementById('wizard-progress');
    if (progress) {
        progress.style.width = `${Math.round((step - 1) / (wizardTotalSteps - 1) * 100)}%`;
    }

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const skipBtn = document.getElementById('skip-btn');

    if (prevBtn) prevBtn.disabled = step === 1;
    if (nextBtn) nextBtn.textContent = step === wizardTotalSteps ? 'Completa' : 'Avanti';

    const mandatorySteps = [1, 2, 4, 5];
    const isMandatory = mandatorySteps.includes(step);

    if (skipBtn) {
        if (!isMandatory && step < wizardTotalSteps) {
            skipBtn.style.display = 'inline-block';
        } else {
            skipBtn.style.display = 'none';
        }
    }
}


function validateStep(step) {
    const stepEl = document.querySelector(`.wizard-step[data-step='${step}']`);
    if (!stepEl) return true;

    const mandatorySteps = [1, 2, 4, 5];
    const isMandatory = mandatorySteps.includes(step);
    const inputs = stepEl.querySelectorAll('input, select');

    if (!isMandatory) {
        return true;
    }

    for (const input of inputs) {
        const value = (input.value || '').toString().trim();
        if (value === '') {
            alert('Compila tutti i campi obbligatori prima di procedere.');
            input.focus();
            return false;
        }
        if (input.type === 'number' && !isFinite(Number(input.value))) {
            alert('Inserisci un numero valido.');
            input.focus();
            return false;
        }
    }
    return true;
}


function nextStep() {
    if (!validateStep(wizardCurrentStep)) return;

    if (wizardCurrentStep < wizardTotalSteps) {
        wizardCurrentStep += 1;
        showWizardStep(wizardCurrentStep);
    } else {
        finalizzaProfilo();
    }
}

function skipStep() {
    if (wizardCurrentStep < wizardTotalSteps) {
        wizardCurrentStep += 1;
        showWizardStep(wizardCurrentStep);
    }
}

function prevStep() {
    if (wizardCurrentStep > 1) {
        wizardCurrentStep -= 1;
        showWizardStep(wizardCurrentStep);
    }
}

function finalizzaProfilo() {
    const weight = parseFloat(document.getElementById('wizard-weight').value);
    const height = parseFloat(document.getElementById('wizard-height').value);
    const age = parseInt(document.getElementById('wizard-age').value, 10);

    const profile = {
        username: document.getElementById('username').value,
        sex: document.getElementById('user-sex').value,
        age: age,
        weight: weight,
        height: height,
        jobType: document.getElementById('wizard-job').value,
        workoutsPerWeek: parseInt(document.getElementById('wizard-workouts').value, 10),
        goal: document.getElementById('wizard-goal').value,
        diet: document.getElementById('wizard-diet').value,
        allergies: document.getElementById('wizard-allergies').value,
        intolerances: document.getElementById('wizard-intolerances').value,
        mealsPerDay: parseInt(document.getElementById('wizard-meals').value, 10),
        weakPoint: document.getElementById('wizard-weakpoint').value,
        waterIntake: parseFloat(document.getElementById('wizard-water').value)
    };

    profile.acquaObiettivo = parseFloat((weight * 0.035).toFixed(1));

    const baseActivityFactor = {
        sedentario: 1.2,
        moderato: 1.55,
        attivo: 1.725
    }[profile.jobType] || 1.2;

    let activityFactor = baseActivityFactor;
    const workouts = Number(profile.workoutsPerWeek || 0);
    if (workouts >= 5) {
        activityFactor = Math.min(1.9, baseActivityFactor + 0.05);
    } else if (workouts >= 3) {
        activityFactor = Math.min(1.7, baseActivityFactor + 0.03);
    }

    const goalMultiplier = {
        dimagrire: 0.85,
        mantenere: 1.0,
        massa: 1.15
    }[profile.goal] || 1.0;

    const bmr = Math.round((10 * weight) + (6.25 * height) - (5 * age) + (profile.sex === 'uomo' ? 5 : -161));
    const tdee = Math.max(1200, Math.round(bmr * activityFactor * goalMultiplier));

    const carbsGrams = Math.round((tdee * 0.5) / 4);
    const proteinGrams = Math.round((tdee * 0.25) / 4);
    const fatGrams = Math.round((tdee * 0.25) / 9);

    const newProfile = {
        ...profile,
        target: tdee,
        bmr: bmr,
        activityFactor: activityFactor,
        goalMultiplier: goalMultiplier,
        carbsTarget: carbsGrams,
        proteinTarget: proteinGrams,
        fatTarget: fatGrams,
        acquaTarget: profile.acquaObiettivo * 1000,
        micronutrients: {
            fe: 14,
            ca: 1000,
            mg: 350,
            b12: 2.4,
            fol: 400
        }
    };

    userProfile = newProfile;
    localStorage.setItem('nv_profilo', JSON.stringify(newProfile));

    const infoUtente = {
        dataCreazione: new Date().toLocaleDateString(),
        profilo: {...newProfile}
    };
    localStorage.setItem('userDiaryProfile', JSON.stringify(infoUtente));

    setFirstAccess(false);
    initApp(newProfile);
    updateHomeStats();
}

function switchTab(tabId, el) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
}

function mostraSezione(tabId) {
    const target = document.getElementById(tabId);
    if (!target) return;

    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    target.style.display = 'block';

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const btn = document.querySelector(`.nav-item[onclick="mostraSezione('${tabId}')"]`);
    if (btn) btn.classList.add('active');

    if (tabId === 'diario') {
        renderCalendar();
        aggiornaUI();
    }
    if (tabId === 'home') {
        aggiornaUI();
    }
    if (tabId === 'pasti-rapidi') {
        aggiornaListaRicetteSalvate();
    }
}

function cambiaMese(offset) {
    currentMonth.setMonth(currentMonth.getMonth() + offset);
    renderCalendar();
}

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const title = document.getElementById('currentMonthYear');
    if (!grid || !title) return;

    grid.innerHTML = '';
    title.innerText = currentMonth.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });

    const diaryProfileSummary = document.getElementById('diary-profile-summary');
    const diaryData = JSON.parse(localStorage.getItem('userDiaryProfile'));
    if (diaryProfileSummary) {
        if (diaryData && diaryData.profilo) {
            diaryProfileSummary.innerHTML = `
                <div style="margin-bottom: 10px; padding: 10px 12px; background: #f4f9ff; border: 1px solid #dce9f5; border-radius: 14px;">
                    <strong>${diaryData.profilo.username || 'Utente'}</strong> • ${diaryData.profilo.sex || '-'} • ${diaryData.profilo.age || '-'} anni • TDEE: ${diaryData.profilo.target || '-'} kcal
                </div>
            `;
        } else {
            diaryProfileSummary.innerHTML = '';
        }
    }

    const primoGiorno = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const giorniMese = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

    const emptyDays = primoGiorno === 0 ? 6 : primoGiorno - 1;
    for (let i = 0; i < emptyDays; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'cal-empty';
        grid.appendChild(emptyDiv);
    }

    for (let d = 1; d <= giorniMese; d++) {
        const dataIso = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const div = document.createElement('div');
        div.className = 'cal-day';

        if (dataIso === activeDate) {
            div.classList.add('active');
        }

        if (log[dataIso] && log[dataIso].k >= (profilo?.target || 0) && profilo?.target > 0) {
            div.classList.add('complete');
        }

        div.innerText = d;
        div.onclick = () => {
            activeDate = dataIso;
            renderCalendar();
            aggiornaUI();
        };
        grid.appendChild(div);
    }
}

function selectMealType(type, btn) {
    currentMealType = type;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');
}

function aggiornaTotaliGiorno(giorno, entry, segno) {
    giorno.k += (entry.k * segno);
    giorno.p += (entry.p * segno);
    giorno.c += (entry.c * segno);
    giorno.g += (entry.g * segno);
    giorno.fe += (entry.fe * segno);
    giorno.ca += (entry.ca * segno);
    giorno.b12 += (entry.b12 * segno);
}

function rimuoviPasto(index) {
    if (!log[activeDate] || !log[activeDate].items || !log[activeDate].items[index]) return;
    const entry = log[activeDate].items[index];
    aggiornaTotaliGiorno(log[activeDate], entry, -1);
    log[activeDate].items.splice(index, 1);

    if (log[activeDate].items.length === 0) {
        delete log[activeDate];
    }

    localStorage.setItem('nv_log', JSON.stringify(log));
    renderCalendar();
    aggiornaUI();
}

function cercaAlimento(e, context) {
    const query = e.target.value.toLowerCase();
    let resultsId;
    if (context === 'main') resultsId = 'search-results';
    else if (context === 'ricetta') resultsId = 'recipe-results';
    else if (context === 'ai') resultsId = 'ai-results';
    const resDiv = document.getElementById(resultsId);
    if (!resDiv) return;
    resDiv.innerHTML = "";

    if (query.length < 2) return;

    const fullDb = [...db, ...ricetteSalvate];
    const filtered = fullDb.filter(f => (f.nome && f.nome.toLowerCase().includes(query)) || (f.n && f.n.toLowerCase().includes(query)));

    filtered.forEach(f => {
        const div = document.createElement('div');
        div.className = 'result-item';
        const nomeCibo = f.nome || f.n;
        const kcalCibo = f.kcal || f.k;
        div.innerHTML = `<span>${nomeCibo}</span> <small>${Math.round(kcalCibo)} kcal/100g</small>`;
        div.onclick = () => {
            selectedFood = f;
            if (context === 'main') {
                document.getElementById('add-panel').style.display = 'block';
                document.getElementById('selected-name').innerText = nomeCibo;
            } else if (context === 'ricetta') {
                document.getElementById('recipe-add-panel').style.display = 'flex';
                document.getElementById('recipe-selected-name').innerText = nomeCibo;
                document.getElementById('recipe-qty').focus();
            } else if (context === 'ai') {
                if (!aiSelectedIngredients.includes(nomeCibo)) {
                    aiSelectedIngredients.push(nomeCibo);
                }
                const list = document.getElementById('ai-ingredient-list');
                list.innerHTML = aiSelectedIngredients.map(item => `<li style="padding:4px 0;">• ${item}</li>`).join('');
                // Aggiungi ingredienti al campo principale AI per facilitare la generazione
                const discoverInput = document.getElementById('discover-ingredients');
                discoverInput.value = aiSelectedIngredients.join(', ');
            }
            resDiv.innerHTML = "";
            e.target.value = "";
        };
        resDiv.appendChild(div);
    });
}

function selezionaCibo(alimento) {
    ciboSelezionato = alimento;
    document.getElementById('selected-food-name').innerText = alimento.nome;
    document.getElementById('add-panel').style.display = 'flex';
    document.getElementById('search-results').innerHTML = '';
}

function salvaPasto() {
    const qty = parseFloat(document.getElementById('qty').value);
    if (!selectedFood || isNaN(qty)) return;

    const ratio = qty / 100;
    const entry = {
        n: selectedFood.nome || selectedFood.n,
        t: currentMealType,
        k: (selectedFood.kcal || selectedFood.k) * ratio,
        p: (selectedFood.proteine || selectedFood.p) * ratio,
        c: (selectedFood.carboidrati || selectedFood.c) * ratio,
        g: (selectedFood.grassi || selectedFood.g) * ratio,
        fe: (selectedFood.fe || 0) * ratio,
        ca: (selectedFood.ca || 0) * ratio,
        b12: (selectedFood.b12 || 0) * ratio
    };

    if (!log[activeDate]) {
        log[activeDate] = { k:0, p:0, c:0, g:0, w:0, fe:0, ca:0, b12:0, items: [] };
    }

    log[activeDate].items.push(entry);
    aggiornaTotaliGiorno(log[activeDate], entry, 1);

    localStorage.setItem('nv_log', JSON.stringify(log));
    document.getElementById('add-panel').style.display = 'none';
    renderCalendar();
    aggiornaUI();
}

function aggiungiIngredienteRicetta() {
    if (!selectedFood) {
        alert('Seleziona prima un ingrediente!');
        return;
    }

    const qty = parseFloat(document.getElementById('recipe-qty').value);
    if (isNaN(qty) || qty <= 0) {
        alert('Inserisci una quantità valida');
        document.getElementById('recipe-qty').focus();
        return;
    }

    const ratio = qty / 100;
    const item = {
        n: selectedFood.nome || selectedFood.n,
        k: (selectedFood.kcal || selectedFood.k) * ratio,
        p: (selectedFood.proteine || selectedFood.p) * ratio,
        c: (selectedFood.carboidrati || selectedFood.c) * ratio,
        g: (selectedFood.grassi || selectedFood.g) * ratio,
        fe: (selectedFood.fe || 0) * ratio,
        ca: (selectedFood.ca || 0) * ratio,
        b12: (selectedFood.b12 || 0) * ratio,
        qty
    };

    tempRecipe.items.push(item);
    tempRecipe.k += item.k;
    tempRecipe.p += item.p;
    tempRecipe.c += item.c;
    tempRecipe.g += item.g;
    tempRecipe.fe += item.fe;
    tempRecipe.ca += item.ca;
    tempRecipe.b12 += item.b12;

    renderTempRecipe();
    document.getElementById('recipe-search').focus();
    document.getElementById('recipe-qty').value = 100;
    document.getElementById('recipe-search').value = '';
    document.getElementById('recipe-results').innerHTML = '';
}

function confermaAggiunta() {
    const qty = parseFloat(document.getElementById('food-qty').value);
    const entry = {
        nome: ciboSelezionato.nome,
        kcal: Math.round((ciboSelezionato.kcal * qty) / 100),
        p: ((ciboSelezionato.proteine * qty) / 100).toFixed(1),
        c: ((ciboSelezionato.carboidrati * qty) / 100).toFixed(1),
        g: ((ciboSelezionato.grassi * qty) / 100).toFixed(1),
        qty: qty
    };
    diario.push(entry);
    localStorage.setItem('nv_diario', JSON.stringify(diario));
    document.getElementById('add-panel').style.display = 'none';
    aggiornaUI();
}

function renderTempRecipe() {
    const list = document.getElementById('current-recipe-items');
    if (!list) return;

    list.innerHTML = tempRecipe.items.map((item, idx) => `
        <li style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:#f8f9fd;border-radius:12px;margin: 6px 0;">
            <span style="font-family:'Inter',sans-serif;">${item.n} - ${item.qty}g</span>
            <span style="font-weight:700;">${Math.round(item.k)} kcal</span>
            <button onclick="rimuoviIngredienteRicetta(${idx})" style="background:#ff9800;border:none;color:white;border-radius:8px;padding:4px 10px;cursor:pointer;">×</button>
        </li>
    `).join('');

    const summary = document.getElementById('recipe-summary');
    if (summary) {
        summary.style.display = 'block';
        summary.innerHTML = `
            <strong>Analisi per porzione:</strong><br>
            Kcal: ${Math.round(tempRecipe.k)} | P: ${tempRecipe.p.toFixed(1)}g | C: ${tempRecipe.c.toFixed(1)}g | G: ${tempRecipe.g.toFixed(1)}g
        `;
    }
}

function rimuoviIngredienteRicetta(index) {
    const item = tempRecipe.items[index];
    if (!item) return;
    tempRecipe.k -= item.k;
    tempRecipe.p -= item.p;
    tempRecipe.c -= item.c;
    tempRecipe.g -= item.g;
    tempRecipe.fe -= item.fe;
    tempRecipe.ca -= item.ca;
    tempRecipe.b12 -= item.b12;
    tempRecipe.items.splice(index, 1);
    renderTempRecipe();
}

function salvaRicettaDefinitiva() {
    const nome = document.getElementById('recipe-name').value.trim();
    if (!nome || tempRecipe.items.length === 0) {
        alert('Inserisci un nome e almeno un ingrediente!');
        return;
    }

    const nomeFormattato = nome;
    const nuovaRicetta = {
        n: nomeFormattato,
        k: tempRecipe.k,
        p: tempRecipe.p,
        c: tempRecipe.c,
        g: tempRecipe.g,
        fe: tempRecipe.fe,
        ca: tempRecipe.ca,
        b12: tempRecipe.b12,
        items: [...tempRecipe.items]
    };

    ricetteSalvate.push(nuovaRicetta);
    localStorage.setItem('nv_ricette', JSON.stringify(ricetteSalvate));

    tempRecipe = { items: [], k: 0, p: 0, c: 0, g: 0, fe: 0, ca: 0, b12: 0 };
    document.getElementById('recipe-name').value = '';
    document.getElementById('recipe-search').value = '';
    document.getElementById('recipe-results').innerHTML = '';
    document.getElementById('recipe-summary').style.display = 'none';
    document.getElementById('current-recipe-items').innerHTML = '';

    aggiornaListaRicetteSalvate();
    alert('Ricetta salvata con successo!');
}

function modificaRicetta(idx) {
    const r = ricetteSalvate[idx];
    if (!r) return;

    document.getElementById('recipe-name').value = r.n;
    tempRecipe = {
        items: r.items ? [...r.items] : [],
        k: r.k || 0,
        p: r.p || 0,
        c: r.c || 0,
        g: r.g || 0,
        fe: r.fe || 0,
        ca: r.ca || 0,
        b12: r.b12 || 0
    };

    ricetteSalvate.splice(idx, 1);
    localStorage.setItem('nv_ricette', JSON.stringify(ricetteSalvate));
    renderTempRecipe();
    aggiornaListaRicetteSalvate();
    document.getElementById('recipe-search').focus();
}

function eliminaRicetta(idx) {
    if (!confirm('Vuoi davvero eliminare questa ricetta?')) return;
    ricetteSalvate.splice(idx, 1);
    localStorage.setItem('nv_ricette', JSON.stringify(ricetteSalvate));
    aggiornaListaRicetteSalvate();
}

function aggiornaListaRicetteSalvate() {
    const list = document.getElementById('preset-list');
    if (!list) return;

    list.innerHTML = ricetteSalvate.map((r, i) => `
        <li style="background:#fff;margin-bottom:8px;padding:10px;border-radius:15px;box-shadow:0 6px 14px rgba(31,57,87,0.08);">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <strong style="font-family:'Poppins',sans-serif;">${r.n}</strong><br>
                    <small style="color:#7f8c8d;">${Math.round(r.k)} kcal / porzione</small>
                </div>
                <div style="display:flex;gap:6px;">
                    <button onclick="modificaRicetta(${i})" style="background:#34b27f;color:white;border:none;border-radius:10px;padding:5px 8px;">✎</button>
                    <button onclick="eliminaRicetta(${i})" style="background:#ff9800;color:white;border:none;border-radius:10px;padding:5px 8px;">🗑</button>
                </div>
            </div>
        </li>
    `).join('');
}

function aggiornaUI() {
    if (!profilo) return;

    const giorno = log[activeDate] || { k:0, p:0, c:0, g:0, fe:0, ca:0, b12:0, items: [] };

    updateHomeStats();

    const feTarget = 14; const caTarget = 1000; const b12Target = 2.4;
    const fePerc = Math.min(100, (giorno.fe / feTarget) * 100);
    const caPerc = Math.min(100, (giorno.ca / caTarget) * 100);
    const b12Perc = Math.min(100, (giorno.b12 / b12Target) * 100);

    const feBar = document.getElementById('bar-fe');
    const caBar = document.getElementById('bar-ca');
    const b12Bar = document.getElementById('bar-b12');

    if (feBar) feBar.style.width = `${fePerc}%`;
    if (caBar) caBar.style.width = `${caPerc}%`;
    if (b12Bar) b12Bar.style.width = `${b12Perc}%`;

    document.getElementById('txt-fe').innerText = `${giorno.fe.toFixed(1)} / ${feTarget}mg (${Math.round(fePerc)}%)`;
    document.getElementById('txt-ca').innerText = `${giorno.ca.toFixed(1)} / ${caTarget}mg (${Math.round(caPerc)}%)`;
    document.getElementById('txt-b12').innerText = `${giorno.b12.toFixed(2)} / ${b12Target}µg (${Math.round(b12Perc)}%)`;

    const list = document.getElementById('day-log-list');
    if (list) {
        list.innerHTML = giorno.items.map((item, idx) => `
            <li class="pasto-item"><span><strong>${item.t || ''}</strong> ${item.n}</span><span>${Math.round(item.k)} kcal</span><button onclick="rimuoviPasto(${idx})">×</button></li>
        `).join('');
    }

    const dateTitle = document.getElementById('date-title-pretty');
    if (dateTitle) {
        dateTitle.innerText = new Date(activeDate).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'short' });
    }

    updateHomeStats();
}


function aggiornaBarra(id, attuale, target) {
    const perc = Math.min((attuale / target) * 100, 100);
    document.getElementById(`${id}-bar`).style.width = perc + '%';
    document.getElementById(`${id}-val`).innerText = `${Math.round(attuale)} / ${target}g`;
}

function aggiornaAcqua(v) {
    acqua = Math.max(0, acqua + v);
    localStorage.setItem('nv_acqua', acqua);
    aggiornaUI();
}

function rimuovi(index) {
    diario.splice(index, 1);
    localStorage.setItem('nv_diario', JSON.stringify(diario));
    aggiornaUI();
}

function generaRicettaAI() {
    let ingredienti = document.getElementById('discover-ingredients').value || "quello che trovi in frigo";
    if (aiSelectedIngredients.length > 0) {
        ingredienti = aiSelectedIngredients.join(', ');
    }
    const persone = parseInt(document.getElementById('discover-people').value) || 1;
    const resultBox = document.getElementById('ai-recipe-result');

    if (persone < 1) {
        alert("Inserisci un numero di persone valido!");
        return;
    }

    resultBox.style.display = 'block';
    resultBox.innerHTML = `
        <h4 style="color: var(--info); margin-bottom: 10px;">✨ Generazione in corso...</h4>
        <p style="font-size: 0.9rem; color: #7f8c8d;">
            Sto analizzando gli ingredienti: <b>${ingredienti}</b> per <b>${persone} persone</b>.<br><br>
            <i>(Nota tecnica: L'interfaccia è pronta! Per farti generare la ricetta vera e propria, dovremo collegare questa funzione al backend tramite API.)</i>
        </p>
    `;
}

let kcalChart;

function renderChart(totalCalories, remaining) {
    const chartEl = document.getElementById('kcalChart');
    if (!chartEl || !chartEl.getContext) return;

    const ctx = chartEl.getContext('2d');
    const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#34b27f';
    const neutral = '#E5E7EB';

    if (kcalChart) {
        kcalChart.data.datasets[0].data = [totalCalories, remaining];
        kcalChart.update();
        return;
    }

    kcalChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Consumate', 'Rimanenti'],
            datasets: [{
                data: [totalCalories, remaining],
                backgroundColor: [primary, neutral],
                borderWidth: 0,
                borderRadius: 20
            }]
        },
        options: {
            cutout: '85%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function updateHomeStats() {
    const giorno = log[activeDate] || { k: 0, p: 0, c: 0, g: 0, w: 0, items: [] };
    const totalCalories = Math.round(giorno.k || 0);
    const carbs = Math.round(giorno.c || 0);
    const protein = Math.round(giorno.p || 0);
    const fats = Math.round(giorno.g || 0);

    const goal = (profilo && profilo.target) ? Math.round(profilo.target) : 2200;
    const remaining = Math.max(0, goal - totalCalories);

    const centerDisplay = document.getElementById('center-kcal-value');
    if (centerDisplay) centerDisplay.innerText = remaining;

    const intakeDisplay = document.getElementById('home-kcal-intake');
    if (intakeDisplay) intakeDisplay.innerText = `${totalCalories} kcal`;

    const goalDisplay = document.getElementById('home-kcal-goal');
    if (goalDisplay) goalDisplay.innerText = `${goal} kcal`;

    const carbDisplay = document.getElementById('home-carb');
    const protDisplay = document.getElementById('home-prot');
    const fatDisplay = document.getElementById('home-fat');
    const carbTarget = (profilo && profilo.carbsTarget) ? profilo.carbsTarget : 85;
    const protTarget = (profilo && profilo.proteinTarget) ? profilo.proteinTarget : 360;
    const fatTarget = (profilo && profilo.fatTarget) ? profilo.fatTarget : 180;

    if (carbDisplay) carbDisplay.innerText = `${carbs}/${carbTarget} g`;
    if (protDisplay) protDisplay.innerText = `${protein}/${protTarget} g`;
    if (fatDisplay) fatDisplay.innerText = `${fats}/${fatTarget} g`;

    const barCarb = document.getElementById('bar-carb');
    const barProt = document.getElementById('bar-prot');
    const barFat = document.getElementById('bar-fat');

    if (barCarb) barCarb.style.width = `${Math.min(100, (carbs / carbTarget) * 100)}%`;
    if (barProt) barProt.style.width = `${Math.min(100, (protein / protTarget) * 100)}%`;
    if (barFat) barFat.style.width = `${Math.min(100, (fats / fatTarget) * 100)}%`;

    const acquaMl = (giorno.w || (profilo && profilo.waterIntake ? profilo.waterIntake * 1000 : 0) || 0);
    const acquaTargetMl = (profilo && profilo.acquaTarget) ? profilo.acquaTarget : ((profilo && profilo.acquaObiettivo) ? profilo.acquaObiettivo * 1000 : 7000);
    const acquaPercent = acquaTargetMl ? Math.min(100, (acquaMl / acquaTargetMl) * 100) : 0;

    const acquaDisplay = document.getElementById('val-water');
    if (acquaDisplay) acquaDisplay.innerText = `${(acquaMl/1000).toFixed(1)} / ${(acquaTargetMl/1000).toFixed(1)} L`;

    const acquaBar = document.getElementById('bar-water');
    if (acquaBar) acquaBar.style.width = `${acquaPercent}%`;

    const homeWater = document.getElementById('home-water');
    if (homeWater && profilo && profilo.acquaObiettivo) {
        homeWater.innerText = `${profilo.acquaObiettivo.toFixed(1)} L`;
    }

    const waterGoalDisplay = document.getElementById('water-goal-display');
    if (waterGoalDisplay && profilo && profilo.acquaObiettivo) {
        waterGoalDisplay.innerText = `${profilo.acquaObiettivo.toFixed(1)} L`;
    }

    const valFe = document.getElementById('val-fe');
    if (valFe) valFe.innerText = `${(giorno.fe||0).toFixed(1)} / 14 mg`;
    const valCa = document.getElementById('val-ca');
    if (valCa) valCa.innerText = `${(giorno.ca||0).toFixed(1)} / 1000 mg`;
    const valMg = document.getElementById('val-mg');
    if (valMg) valMg.innerText = `${(giorno.mg||0).toFixed(1)} / 300 mg`;
    const valK = document.getElementById('val-k');
    if (valK) valK.innerText = `${(giorno.k||0).toFixed(1)} / 3500 mg`;
    const valB12 = document.getElementById('val-b12');
    if (valB12) valB12.innerText = `${(giorno.b12||0).toFixed(1)} / 2.4 µg`;
    const valFol = document.getElementById('val-fol');
    if (valFol) valFol.innerText = `${(giorno.fol||0).toFixed(1)} / 400 µg`;

    const barFe = document.getElementById('bar-fe');
    if (barFe) barFe.style.width = `${Math.min(100, ((giorno.fe||0)/14)*100)}%`;
    const barCa = document.getElementById('bar-ca');
    if (barCa) barCa.style.width = `${Math.min(100, ((giorno.ca||0)/1000)*100)}%`;
    const barMg = document.getElementById('bar-mg');
    if (barMg) barMg.style.width = `${Math.min(100, ((giorno.mg||0)/300)*100)}%`;
    const barK = document.getElementById('bar-k');
    if (barK) barK.style.width = `${Math.min(100, ((giorno.k||0)/3500)*100)}%`;
    const barB12 = document.getElementById('bar-b12');
    if (barB12) barB12.style.width = `${Math.min(100, ((giorno.b12||0)/2.4)*100)}%`;
    const barFol = document.getElementById('bar-fol');
    if (barFol) barFol.style.width = `${Math.min(100, ((giorno.fol||0)/400)*100)}%`;

    renderChart(totalCalories, remaining);
}

function logout() {
    localStorage.clear();
    location.reload();
}