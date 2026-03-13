const db = [
    // --- CARNI, INTERIORA E SELVAGGINA ---
    { n: "Cuore di bovino", k: 112, p: 17.0, c: 0.1, g: 3.9, fe: 4.8, ca: 10, b12: 8.5 },
    { n: "Lingua di bovino", k: 224, p: 15.0, c: 3.7, g: 16.0, fe: 2.5, ca: 10, b12: 3.5 },
    { n: "Rognone di bovino (rene)", k: 103, p: 17.0, c: 0.9, g: 3.0, fe: 4.6, ca: 12, b12: 25.0 },
    { n: "Polmone di bovino", k: 92, p: 16.0, c: 0.0, g: 2.5, fe: 6.5, ca: 8, b12: 3.8 },
    { n: "Cervello di bovino", k: 143, p: 11.0, c: 1.5, g: 10.0, fe: 1.6, ca: 9, b12: 9.0 },
    { n: "Carne di struzzo", k: 114, p: 25.0, c: 0.0, g: 1.2, fe: 3.2, ca: 6, b12: 4.5 },
    { n: "Carne di cervo", k: 120, p: 23.0, c: 0.0, g: 2.4, fe: 3.4, ca: 7, b12: 2.8 },
    { n: "Carne di cinghiale", k: 122, p: 21.0, c: 0.0, g: 3.3, fe: 1.1, ca: 12, b12: 0.8 },
    { n: "Piccione (carne)", k: 142, p: 17.5, c: 0.0, g: 7.5, fe: 4.5, ca: 13, b12: 0.5 },
    { n: "Midollo osseo", k: 786, p: 6.7, c: 0.0, g: 84.0, fe: 4.5, ca: 12, b12: 0.1 },
    { n: "Animelle (timo/pancréas)", k: 240, p: 15.0, c: 0.0, g: 20.0, fe: 2.0, ca: 10, b12: 0.5 },
    { n: "Cotechino (fresco)", k: 450, p: 17.0, c: 0.0, g: 42.0, fe: 1.5, ca: 15, b12: 1.0 },
    { n: "Zampone", k: 360, p: 19.0, c: 0.0, g: 31.0, fe: 2.1, ca: 18, b12: 1.1 },
    { n: "Sanguinaccio", k: 379, p: 15.0, c: 1.3, g: 34.0, fe: 15.0, ca: 10, b12: 2.0 },
    { n: "Carne di capra", k: 109, p: 20.0, c: 0.0, g: 2.3, fe: 3.7, ca: 12, b12: 1.2 },
    { n: "Anatra (petto)", k: 140, p: 20.0, c: 0.0, g: 6.0, fe: 4.5, ca: 11, b12: 0.3 },
    { n: "Oca (carne)", k: 161, p: 22.0, c: 0.0, g: 7.0, fe: 2.5, ca: 13, b12: 0.4 },
    { n: "Quaglia (carne)", k: 134, p: 22.0, c: 0.0, g: 4.5, fe: 4.0, ca: 14, b12: 0.5 },
    { n: "Vitello (fesa)", k: 107, p: 21.0, c: 0.0, g: 2.0, fe: 1.0, ca: 10, b12: 1.4 },
    { n: "Pancetta di maiale", k: 418, p: 14.0, c: 0.0, g: 39.0, fe: 0.8, ca: 8, b12: 0.5 },
    { n: "Salame Milano", k: 336, p: 22.0, c: 1.0, g: 27.0, fe: 1.2, ca: 15, b12: 1.0 },
    { n: "Mortadella", k: 311, p: 16.0, c: 0.0, g: 28.0, fe: 1.5, ca: 20, b12: 1.5 },
    { n: "Speck", k: 300, p: 30.0, c: 0.0, g: 20.0, fe: 2.5, ca: 10, b12: 1.0 },
    { n: "Guanciale", k: 655, p: 4.0, c: 0.0, g: 69.0, fe: 0.5, ca: 5, b12: 0.2 },
    { n: "Salsiccia maiale", k: 346, p: 14.0, c: 0.0, g: 31.0, fe: 1.1, ca: 10, b12: 0.8 },
    { n: "Wurstel (suino)", k: 269, p: 13.0, c: 2.0, g: 23.0, fe: 1.0, ca: 15, b12: 1.2 },
    { n: "Trippa di bovino", k: 94, p: 16.0, c: 0.0, g: 3.0, fe: 0.6, ca: 69, b12: 0.7 },
    { n: "Roast beef", k: 111, p: 22.0, c: 0.0, g: 2.0, fe: 2.5, ca: 10, b12: 1.8 },
    { n: "Faraona", k: 134, p: 23.0, c: 0.0, g: 4.0, fe: 1.5, ca: 12, b12: 0.5 },
    { n: "Tacchino (salume)", k: 104, p: 24.0, c: 0.0, g: 1.0, fe: 1.0, ca: 12, b12: 0.4 },

    // --- PESCE E FRUTTI DI MARE ---
    { n: "Luccio", k: 88, p: 19.0, c: 0.0, g: 0.7, fe: 0.5, ca: 20, b12: 2.0 },
    { n: "Persico reale", k: 91, p: 19.0, c: 0.0, g: 0.9, fe: 0.6, ca: 15, b12: 1.8 },
    { n: "Cernia", k: 92, p: 19.0, c: 0.0, g: 1.0, fe: 0.8, ca: 25, b12: 0.7 },
    { n: "Dentice", k: 100, p: 20.0, c: 0.0, g: 1.7, fe: 0.5, ca: 30, b12: 0.4 },
    { n: "Gallinella di mare", k: 101, p: 19.0, c: 0.0, g: 2.3, fe: 0.4, ca: 20, b12: 1.5 },
    { n: "Razza", k: 78, p: 18.0, c: 0.0, g: 0.7, fe: 0.7, ca: 15, b12: 3.0 },
    { n: "Pagello", k: 101, p: 21.0, c: 0.0, g: 1.9, fe: 0.4, ca: 40, b12: 1.2 },
    { n: "Sarago", k: 103, p: 20.0, c: 0.0, g: 2.5, fe: 0.9, ca: 35, b12: 1.1 },
    { n: "Mormora", k: 97, p: 20.0, c: 0.0, g: 1.5, fe: 0.5, ca: 25, b12: 1.0 },
    { n: "Bottarga (muggine)", k: 400, p: 35.0, c: 0.0, g: 25.0, fe: 2.0, ca: 80, b12: 5.0 },
    { n: "Baccalà (ammollato)", k: 95, p: 21.0, c: 0.0, g: 1.0, fe: 0.5, ca: 25, b12: 1.5 },
    { n: "Stoccafisso (secco)", k: 350, p: 80.0, c: 0.0, g: 3.0, fe: 2.5, ca: 150, b12: 10.0 },
    { n: "Lumache di terra", k: 90, p: 16.0, c: 2.0, g: 1.4, fe: 3.5, ca: 170, b12: 0.5 },
    { n: "Moscardini", k: 72, p: 15.0, c: 0.7, g: 1.0, fe: 1.5, ca: 30, b12: 5.0 },
    { n: "Panocchie", k: 69, p: 13.0, c: 0.0, g: 1.7, fe: 0.8, ca: 45, b12: 1.0 },
    { n: "Pesce spada", k: 144, p: 20.0, c: 0.0, g: 6.0, fe: 0.8, ca: 5, b12: 1.5 },
    { n: "Trota salmonata", k: 148, p: 21.0, c: 0.0, g: 6.0, fe: 0.5, ca: 20, b12: 4.5 },
    { n: "Anguilla", k: 236, p: 15.0, c: 0.0, g: 19.0, fe: 1.0, ca: 20, b12: 3.0 },
    { n: "Rana pescatrice", k: 76, p: 14.0, c: 0.0, g: 1.0, fe: 0.3, ca: 15, b12: 0.8 },
    { n: "Sogliola", k: 86, p: 15.0, c: 0.0, g: 1.0, fe: 0.8, ca: 25, b12: 1.5 },
    { n: "Platessa", k: 86, p: 15.0, c: 0.0, g: 1.0, fe: 0.2, ca: 20, b12: 2.0 },
    { n: "Astice", k: 90, p: 19.0, c: 0.0, g: 1.0, fe: 0.6, ca: 60, b12: 1.2 },
    { n: "Granchio", k: 84, p: 18.0, c: 0.0, g: 1.0, fe: 0.7, ca: 90, b12: 9.0 },
    { n: "Scampi", k: 85, p: 17.0, c: 0.0, g: 1.0, fe: 0.8, ca: 50, b12: 1.0 },
    { n: "Capesante", k: 69, p: 12.0, c: 3.0, g: 1.0, fe: 0.5, ca: 10, b12: 1.5 },
    { n: "Seppia", k: 79, p: 16.0, c: 0.0, g: 1.0, fe: 0.8, ca: 30, b12: 1.2 },
    { n: "Aringa", k: 158, p: 18.0, c: 0.0, g: 9.0, fe: 1.1, ca: 60, b12: 13.0 },
    { n: "Triglia", k: 117, p: 19.0, c: 0.0, g: 4.0, fe: 1.0, ca: 30, b12: 1.2 },
    { n: "Carpa", k: 127, p: 18.0, c: 0.0, g: 5.0, fe: 1.2, ca: 40, b12: 1.5 },
    { n: "Caviale", k: 264, p: 25.0, c: 4.0, g: 18.0, fe: 11.8, ca: 275, b12: 20.0 },

    // --- LATTICINI E ALTERNATIVE ---
    { n: "Asiago (pressato)", k: 368, p: 24.0, c: 0.5, g: 30.0, fe: 0.2, ca: 700, b12: 1.5 },
    { n: "Taleggio", k: 300, p: 19.0, c: 0.4, g: 25.0, fe: 0.2, ca: 450, b12: 1.6 },
    { n: "Quartirolo Lombardo", k: 297, p: 18.0, c: 0.0, g: 25.0, fe: 0.1, ca: 400, b12: 1.2 },
    { n: "Fontina", k: 389, p: 24.5, c: 1.5, g: 31.0, fe: 0.3, ca: 750, b12: 2.1 },
    { n: "Montasio", k: 396, p: 26.0, c: 1.0, g: 32.0, fe: 0.2, ca: 800, b12: 1.8 },
    { n: "Robiola", k: 338, p: 11.0, c: 2.3, g: 32.0, fe: 0.1, ca: 300, b12: 0.8 },
    { n: "Crescenza", k: 281, p: 16.0, c: 1.9, g: 23.0, fe: 0.1, ca: 430, b12: 1.0 },
    { n: "Stracchino", k: 300, p: 18.5, c: 0.0, g: 25.0, fe: 0.1, ca: 450, b12: 1.5 },
    { n: "Roquefort", k: 369, p: 21.5, c: 2.0, g: 30.6, fe: 0.6, ca: 660, b12: 0.6 },
    { n: "Emmental", k: 395, p: 28.0, c: 0.0, g: 30.0, fe: 0.2, ca: 1000, b12: 3.0 },
    { n: "Grana Padano", k: 398, p: 33.0, c: 0.0, g: 29.0, fe: 0.1, ca: 1165, b12: 1.5 },
    { n: "Scamorza affumicata", k: 210, p: 25.0, c: 1.0, g: 12.0, fe: 0.2, ca: 600, b12: 1.2 },
    { n: "Formaggio capra stag.", k: 450, p: 30.0, c: 2.0, g: 36.0, fe: 0.5, ca: 900, b12: 1.1 },
    { n: "Siero latte polvere", k: 350, p: 12.0, c: 75.0, g: 1.0, fe: 0.2, ca: 600, b12: 0.5 },
    { n: "Quark (magro)", k: 68, p: 12.0, c: 4.0, g: 0.2, fe: 0.1, ca: 100, b12: 0.6 },
    { n: "Pecorino Romano", k: 387, p: 26.0, c: 0.0, g: 31.0, fe: 0.3, ca: 1150, b12: 1.5 },
    { n: "Provolone", k: 351, p: 25.0, c: 2.0, g: 26.0, fe: 0.2, ca: 750, b12: 1.5 },
    { n: "Brie", k: 334, p: 21.0, c: 0.5, g: 28.0, fe: 0.5, ca: 180, b12: 1.6 },
    { n: "Mascarpone", k: 355, p: 4.0, c: 3.0, g: 36.0, fe: 0.1, ca: 100, b12: 0.2 },
    { n: "Kefir latte intero", k: 60, p: 3.0, c: 4.0, g: 3.0, fe: 0.0, ca: 120, b12: 0.4 },
    { n: "Latte di soia", k: 33, p: 3.0, c: 3.0, g: 1.0, fe: 0.6, ca: 25, b12: 0.0 },
    { n: "Latte di mandorla", k: 15, p: 0.5, c: 1.0, g: 1.0, fe: 0.1, ca: 120, b12: 0.0 },

    // --- CEREALI E DERIVATI ---
    { n: "Crusca di frumento", k: 216, p: 15.0, c: 64.0, g: 4.3, fe: 10.0, ca: 70, b12: 0.0 },
    { n: "Germe di grano", k: 360, p: 23.0, c: 52.0, g: 10.0, fe: 6.0, ca: 40, b12: 0.0 },
    { n: "Pane di Altamura", k: 280, p: 10.0, c: 57.0, g: 1.5, fe: 0.7, ca: 20, b12: 0.0 },
    { n: "Gnocchi di patate", k: 150, p: 3.5, c: 33.0, g: 0.5, fe: 0.4, ca: 10, b12: 0.0 },
    { n: "Farina di segale", k: 338, p: 10.0, c: 75.0, g: 1.6, fe: 2.6, ca: 24, b12: 0.0 },
    { n: "Cous cous (crudo)", k: 376, p: 12.0, c: 77.0, g: 0.6, fe: 1.1, ca: 20, b12: 0.0 },
    { n: "Amaranto (crudo)", k: 371, p: 13.0, c: 65.0, g: 7.0, fe: 7.6, ca: 159, b12: 0.0 },
    { n: "Seitan (crudo)", k: 370, p: 75.0, c: 13.0, g: 1.0, fe: 1.2, ca: 140, b12: 0.0 },

    // --- VERDURE E FRUTTA ---
    { n: "Ortica (foglie)", k: 42, p: 2.7, c: 7.0, g: 0.1, fe: 1.6, ca: 480, b12: 0.0 },
    { n: "Tarassaco (foglie)", k: 45, p: 2.7, c: 9.0, g: 0.7, fe: 3.1, ca: 187, b12: 0.0 },
    { n: "Cavolo nero", k: 35, p: 3.3, c: 6.0, g: 0.7, fe: 1.5, ca: 150, b12: 0.0 },
    { n: "Guava", k: 68, p: 2.6, c: 14.0, g: 1.0, fe: 0.3, ca: 18, b12: 0.0 },
    { n: "Alga Spirulina (ess.)", k: 290, p: 57.0, c: 24.0, g: 7.7, fe: 28.5, ca: 120, b12: 0.0 },
    { n: "Olio di cocco", k: 862, p: 0.0, c: 0.0, g: 100.0, fe: 0.0, ca: 0, b12: 0.0 },
    { n: "Olio di lino", k: 884, p: 0.0, c: 0.0, g: 100.0, fe: 0.0, ca: 0, b12: 0.0 },

    // --- NUOVA LISTA ALIMENTI AGGIUNTA ---
    { n: "Lupini (ammollati)", k: 114, p: 14.8, c: 7.1, g: 2.4, fe: 1.2, ca: 45, b12: 0.0 },
    { n: "Quinoa (cotta)", k: 120, p: 4.4, c: 21.3, g: 1.9, fe: 1.5, ca: 17, b12: 0.0 },
    { n: "Lenticchie (cotte)", k: 116, p: 9.0, c: 20.1, g: 0.4, fe: 3.3, ca: 19, b12: 0.0 },
    { n: "Ceci (cotti)", k: 164, p: 8.9, c: 27.4, g: 2.6, fe: 2.9, ca: 49, b12: 0.0 },
    { n: "Fagioli Neri (cotti)", k: 132, p: 8.9, c: 23.7, g: 0.5, fe: 2.1, ca: 27, b12: 0.0 },
    { n: "Tofu (fermo)", k: 145, p: 15.8, c: 4.3, g: 8.7, fe: 2.7, ca: 350, b12: 0.0 },
    { n: "Tempeh", k: 192, p: 20.3, c: 7.6, g: 10.8, fe: 2.7, ca: 111, b12: 0.1 },
    { n: "Noci del Brasile", k: 656, p: 14.3, c: 12.3, g: 66.4, fe: 2.4, ca: 160, b12: 0.0 },
    { n: "Mandorle", k: 579, p: 21.2, c: 21.7, g: 49.9, fe: 3.7, ca: 264, b12: 0.0 },
    { n: "Semi di Zucca", k: 559, p: 30.2, c: 10.7, g: 49.1, fe: 8.8, ca: 46, b12: 0.0 },
    { n: "Semi di Chia", k: 486, p: 16.5, c: 42.1, g: 30.7, fe: 7.7, ca: 631, b12: 0.0 },
    { n: "Semi di Canapa", k: 553, p: 31.6, c: 8.7, g: 48.8, fe: 8.0, ca: 70, b12: 0.0 },
    { n: "Burro d'Arachidi (naturale)", k: 588, p: 25.1, c: 20.0, g: 50.4, fe: 1.9, ca: 43, b12: 0.0 },
    { n: "Miso", k: 199, p: 11.7, c: 26.5, g: 6.0, fe: 2.5, ca: 57, b12: 0.1 },
    { n: "Lievito Alimentare", k: 375, p: 45.0, c: 35.0, g: 5.0, fe: 5.0, ca: 120, b12: 120.0 },
    { n: "Avocado", k: 160, p: 2.0, c: 8.5, g: 14.7, fe: 0.6, ca: 12, b12: 0.0 },
    { n: "Edamame", k: 121, p: 11.9, c: 8.9, g: 5.2, fe: 2.3, ca: 63, b12: 0.0 },
    { n: "Sogliola (filetto)", k: 91, p: 18.8, c: 0.0, g: 1.2, fe: 0.3, ca: 18, b12: 1.9 },
    { n: "Salmone (selvaggio)", k: 208, p: 20.4, c: 0.0, g: 13.4, fe: 0.3, ca: 12, b12: 3.2 },
    { n: "Uova (intere)", k: 143, p: 12.6, c: 0.7, g: 9.5, fe: 1.8, ca: 56, b12: 1.1 },

    // --- VERDURE A FOGLIA E ORTAGGI ---
    { n: "Lattuga romana", k: 17, p: 1.2, g: 0.3, c: 3.3, f: 2.1 },
    { n: "Lattuga iceberg", k: 14, p: 0.9, g: 0.1, c: 3.0, f: 1.2 },
    { n: "Spinaci freschi", k: 23, p: 2.9, g: 0.4, c: 3.6, f: 2.2 },
    { n: "Cavolo riccio (Kale)", k: 49, p: 4.3, g: 0.9, c: 8.8, f: 3.6 },
    { n: "Bietola da coste", k: 19, p: 1.8, g: 0.2, c: 3.7, f: 1.6 },
    { n: "Cicoria", k: 23, p: 1.7, g: 0.3, c: 4.7, f: 4.0 },
    { n: "Rucola", k: 25, p: 2.6, g: 0.7, c: 3.7, f: 1.6 },
    { n: "Radicchio rosso", k: 23, p: 1.4, g: 0.2, c: 4.5, f: 0.9 },
    { n: "Indivia", k: 17, p: 1.3, g: 0.2, c: 3.4, f: 3.1 },
    { n: "Valeriana (Songino)", k: 21, p: 2.0, g: 0.4, c: 3.6, f: 1.5 },
    { n: "Cime di rapa", k: 22, p: 2.9, g: 0.3, c: 2.0, f: 2.9 },
    { n: "Agretti (Barba di frate)", k: 17, p: 1.8, g: 0.2, c: 2.2, f: 2.2 },
    { n: "Asparagi bianchi", k: 20, p: 2.2, g: 0.1, c: 3.8, f: 2.1 },
    { n: "Asparagi verdi", k: 20, p: 2.2, g: 0.2, c: 3.9, f: 2.1 },
    { n: "Sedano", k: 16, p: 0.7, g: 0.2, c: 3.0, f: 1.6 },
    { n: "Finocchio", k: 31, p: 1.2, g: 0.2, c: 7.3, f: 3.1 },
    { n: "Porro", k: 61, p: 1.5, g: 0.3, c: 14.2, f: 1.8 },
    { n: "Cardo", k: 17, p: 0.7, g: 0.1, c: 4.0, f: 1.6 },
    { n: "Germogli di bambù", k: 27, p: 2.6, g: 0.3, c: 5.2, f: 2.2 },
    { n: "Cuore di palma", k: 115, p: 2.7, g: 0.2, c: 25.6, f: 1.5 },

    // --- CRUCIFERE ---
    { n: "Broccoli", k: 34, p: 2.8, g: 0.4, c: 6.6, f: 2.6 },
    { n: "Cavolfiore bianco", k: 25, p: 1.9, g: 0.3, c: 4.9, f: 2.0 },
    { n: "Cavolfiore viola", k: 25, p: 2.0, g: 0.3, c: 5.0, f: 2.5 },
    { n: "Cavoletti di Bruxelles", k: 43, p: 3.4, g: 0.3, c: 9.0, f: 3.8 },
    { n: "Cavolo cappuccio bianco", k: 25, p: 1.3, g: 0.1, c: 5.8, f: 2.5 },
    { n: "Cavolo rosso", k: 31, p: 1.4, g: 0.2, c: 7.4, f: 2.1 },
    { n: "Cavolo verza", k: 27, p: 2.0, g: 0.1, c: 6.1, f: 2.5 },
    { n: "Cavolo nero toscano", k: 35, p: 3.3, g: 0.7, c: 6.1, f: 2.0 },
    { n: "Broccolo romanesco", k: 31, p: 2.2, g: 0.3, c: 5.5, f: 2.1 },
    { n: "Pak Choi (Bok Choy)", k: 13, p: 1.5, g: 0.2, c: 2.2, f: 1.0 },

    // --- ORTAGGI A FRUTTO ---
    { n: "Pomodoro rosso maturo", k: 18, p: 0.9, g: 0.2, c: 3.9, f: 1.2 },
    { n: "Pomodoro ciliegino", k: 24, p: 1.0, g: 0.2, c: 5.1, f: 1.3 },
    { n: "Peperone rosso", k: 31, p: 1.0, g: 0.3, c: 6.0, f: 2.1 },
    { n: "Peperone giallo", k: 27, p: 1.0, g: 0.2, c: 6.3, f: 0.9 },
    { n: "Peperone verde", k: 20, p: 0.9, g: 0.2, c: 4.6, f: 1.7 },
    { n: "Melanzana", k: 25, p: 1.0, g: 0.2, c: 5.9, f: 3.0 },
    { n: "Zucchina scura", k: 17, p: 1.2, g: 0.3, c: 3.1, f: 1.0 },
    { n: "Zucchina gialla", k: 15, p: 1.1, g: 0.2, c: 2.9, f: 1.0 },
    { n: "Zucca hokkaido", k: 63, p: 1.7, g: 0.5, c: 12.6, f: 2.0 },
    { n: "Zucca butternut", k: 45, p: 1.0, g: 0.1, c: 11.7, f: 2.0 },
    { n: "Cetriolo (con buccia)", k: 15, p: 0.7, g: 0.1, c: 3.6, f: 0.5 },
    { n: "Okra (Gombo)", k: 33, p: 1.9, g: 0.2, c: 7.5, f: 3.2 },
    { n: "Chayote", k: 19, p: 0.8, g: 0.1, c: 4.5, f: 1.7 },
    { n: "Zucca spaghetti", k: 31, p: 0.6, g: 0.6, c: 7.0, f: 1.5 },
    { n: "Cetriolo amaro", k: 17, p: 1.0, g: 0.2, c: 3.7, f: 2.8 },

    // --- RADICI E TUBERI ---
    { n: "Carota", k: 41, p: 0.9, g: 0.2, c: 9.6, f: 2.8 },
    { n: "Patata bianca", k: 77, p: 2.0, g: 0.1, c: 17.5, f: 2.2 },
    { n: "Patata dolce (Batata)", k: 86, p: 1.6, g: 0.1, c: 20.1, f: 3.0 },
    { n: "Barbabietola rossa", k: 43, p: 1.6, g: 0.2, c: 9.6, f: 2.8 },
    { n: "Ravanello", k: 16, p: 0.7, g: 0.1, c: 3.4, f: 1.6 },
    { n: "Daikon", k: 18, p: 0.6, g: 0.1, c: 4.1, f: 1.6 },
    { n: "Pastinaca", k: 75, p: 1.2, g: 0.3, c: 18.0, f: 4.9 },
    { n: "Sedano rapa", k: 42, p: 1.5, g: 0.3, c: 9.2, f: 1.8 },
    { n: "Topinambur", k: 73, p: 2.0, g: 0.0, c: 17.4, f: 1.6 },
    { n: "Rapa bianca", k: 28, p: 0.9, g: 0.1, c: 6.4, f: 1.8 },
    { n: "Rutabaga", k: 37, p: 1.1, g: 0.2, c: 8.6, f: 2.3 },
    { n: "Zenzero (fresco)", k: 80, p: 1.8, g: 0.8, c: 17.8, f: 2.0 },
    { n: "Rafano", k: 48, p: 1.2, g: 0.7, c: 11.3, f: 3.3 },
    { n: "Taro", k: 112, p: 1.5, g: 0.2, c: 26.5, f: 4.1 },
    { n: "Manioca", k: 160, p: 1.4, g: 0.3, c: 38.1, f: 1.8 },

    // --- BULBI E ALTRI ---
    { n: "Cipolla dorata", k: 40, p: 1.1, g: 0.1, c: 9.3, f: 1.7 },
    { n: "Cipolla rossa", k: 40, p: 1.1, g: 0.1, c: 9.4, f: 1.7 },
    { n: "Aglio", k: 149, p: 6.4, g: 0.5, c: 33.1, f: 2.1 },
    { n: "Scalogno", k: 72, p: 2.5, g: 0.1, c: 16.8, f: 3.2 },
    { n: "Carciofo romanesco", k: 47, p: 3.3, g: 0.2, c: 10.5, f: 5.4 },
    { n: "Germogli di erba medica", k: 23, p: 4.0, g: 0.7, c: 2.1, f: 1.9 },
    { n: "Germogli di soia mungo", k: 30, p: 3.0, g: 0.2, c: 5.9, f: 1.8 },
    { n: "Lupini ammolati", k: 119, p: 15.6, g: 2.9, c: 9.9, f: 2.8 },
    { n: "Erba cipollina", k: 30, p: 3.3, g: 0.7, c: 4.4, f: 2.5 },
    { n: "Crescione", k: 11, p: 2.3, g: 0.1, c: 1.3, f: 0.5 },

    // --- CEREALI E PSEUDOCEREALI (CRUDI) ---
    { n: "Riso Carnaroli", k: 349, p: 6.7, g: 0.6, c: 79.1, f: 1.0 },
    { n: "Riso Venere", k: 350, p: 7.5, g: 2.0, c: 75.0, f: 4.0 },
    { n: "Riso Rosso", k: 355, p: 7.0, g: 2.5, c: 76.0, f: 3.5 },
    { n: "Farro dicocco", k: 335, p: 14.7, g: 2.1, c: 67.1, f: 7.0 },
    { n: "Orzo decorticato", k: 354, p: 12.5, g: 2.3, c: 73.5, f: 17.3 },
    { n: "Miglio", k: 378, p: 11.0, g: 4.2, c: 72.8, f: 8.5 },
    { n: "Quinoa bianca", k: 368, p: 14.1, g: 6.1, c: 64.2, f: 7.0 },
    { n: "Quinoa rossa", k: 360, p: 14.0, g: 6.0, c: 62.0, f: 8.0 },
    { n: "Grano saraceno", k: 343, p: 13.2, g: 3.4, c: 71.5, f: 10.0 },
    { n: "Amaranto", k: 371, p: 13.6, g: 7.0, c: 65.2, f: 6.7 },
    { n: "Avena in chicchi", k: 389, p: 16.9, g: 6.9, c: 66.3, f: 10.6 },
    { n: "Segale", k: 338, p: 10.3, g: 1.6, c: 75.9, f: 15.1 },
    { n: "Mais (secco)", k: 365, p: 9.4, g: 4.7, c: 74.3, f: 7.3 },
    { n: "Teff", k: 367, p: 13.3, g: 2.4, c: 73.1, f: 8.0 },
    { n: "Sorgo", k: 339, p: 11.3, g: 3.3, c: 74.6, f: 6.3 },

    // --- LEGUMI SECCHI ---
    { n: "Lenticchie verdi", k: 352, p: 24.6, g: 1.1, c: 63.3, f: 10.7 },
    { n: "Ceci", k: 364, p: 19.3, g: 6.0, c: 60.6, f: 17.4 },
    { n: "Fagioli Cannellini", k: 333, p: 23.4, g: 0.8, c: 60.0, f: 24.4 },
    { n: "Fagioli Borlotti", k: 335, p: 23.0, g: 1.2, c: 60.1, f: 24.9 },
    { n: "Fagioli Mung", k: 347, p: 23.9, g: 1.1, c: 62.6, f: 16.3 },
    { n: "Fagioli neri", k: 341, p: 21.6, g: 1.4, c: 62.4, f: 15.5 },
    { n: "Fagioli Azuki", k: 329, p: 19.9, g: 0.5, c: 62.9, f: 12.7 },
    { n: "Soia gialla", k: 446, p: 36.5, g: 19.9, c: 30.2, f: 9.3 },
    { n: "Fave secche", k: 341, p: 26.1, g: 1.5, c: 58.3, f: 25.0 },
    { n: "Cicerchie", k: 315, p: 29.0, g: 1.0, c: 45.0, f: 10.0 },

    // --- FUNGHI ---
    { n: "Champignon", k: 22, p: 3.1, g: 0.3, c: 3.3, f: 1.0 },
    { n: "Porcino", k: 26, p: 3.9, g: 0.7, c: 1.0, f: 2.5 },
    { n: "Shiitake", k: 34, p: 2.2, g: 0.5, c: 6.8, f: 2.5 },
    { n: "Pleurotus", k: 33, p: 3.3, g: 0.4, c: 6.1, f: 2.3 },
    { n: "Finferlo", k: 38, p: 1.5, g: 0.5, c: 6.9, f: 3.8 }
];

// --- LOGICA APP ---
let currentUser = JSON.parse(localStorage.getItem('nv_user')) || null;
let log = JSON.parse(localStorage.getItem('nv_log')) || {};
let recipes = JSON.parse(localStorage.getItem('nv_recipes')) || [];
let activeDate = new Date().toISOString().split('T')[0];
let currentCalDate = new Date();
let chart = null, tempFood = null, tempRecipeFood = null, selectedMealType = null;

// Stato per la creazione della ricetta corrente
let currentRecipe = { k:0, p:0, c:0, g:0, fe:0, ca:0, b12:0, items: [] };

window.onload = () => { if (currentUser) runSystem(); else mostraSetup(); };

function mostraSetup() {
    document.getElementById('setup-screen').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
}

function salvaProfilo() {
    const w = parseFloat(document.getElementById('peso').value);
    const h = parseFloat(document.getElementById('altezza').value);
    const a = parseInt(document.getElementById('eta').value);
    const obj = parseInt(document.getElementById('obiettivo').value);
    if(!w || !h || !a) return alert("Dati incompleti!");
    let bmr = (document.getElementById('sesso').value === 'uomo') ? (10*w+6.25*h-5*a+5) : (10*w+6.25*h-5*a-161);
    let target = Math.round((bmr * parseFloat(document.getElementById('attivita').value)) + obj);
    currentUser = { target, w, h, a };
    localStorage.setItem('nv_user', JSON.stringify(currentUser));
    runSystem();
}

function runSystem() {
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    refresh(); renderCalendar(); renderRecipes();
}

function renderCalendar() {
    const grid = document.getElementById('calendar-grid'); grid.innerHTML = "";
    const y = currentCalDate.getFullYear(), m = currentCalDate.getMonth();
    document.getElementById('currentMonthYear').innerText = new Intl.DateTimeFormat('it-IT', { month: 'short', year: 'numeric' }).format(currentCalDate);
    
    for(let d=1; d<=new Date(y, m+1, 0).getDate(); d++) {
        const dateStr = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const dayEl = document.createElement('div');
        dayEl.className = 'cal-day';
        dayEl.innerText = d;
        const val = log[dateStr]?.k || 0;
        if (val > 0) {
            if (val > currentUser.target) dayEl.classList.add('status-red');
            else if (val >= currentUser.target * 0.9) dayEl.classList.add('status-green');
        }
        if (dateStr === activeDate) dayEl.classList.add('active');
        dayEl.onclick = () => { activeDate = dateStr; renderCalendar(); refresh(); };
        grid.appendChild(dayEl);
    }
}

// Funzione di ricerca unificata
function cercaAlimento(e, context) {
    const v = e.target.value.toLowerCase();
    const r = context === 'diario' ? document.getElementById('search-results') : document.getElementById('recipe-search-results');
    r.innerHTML = ""; if(v.length < 2) return;

    db.filter(f => f.n.toLowerCase().includes(v)).slice(0, 10).forEach(f => {
        let i = document.createElement('div'); i.className = "result-item"; i.innerText = f.n;
        i.onclick = () => { 
            if(context === 'diario') {
                tempFood = f; document.getElementById('selected-name').innerText = f.n;
                document.getElementById('add-panel').style.display = 'block';
            } else {
                tempRecipeFood = f; document.getElementById('recipe-selected-name').innerText = f.n;
                document.getElementById('recipe-add-panel').style.display = 'block';
            }
            r.innerHTML = "";
        };
        r.appendChild(i);
    });
}

function selectMealType(t) {
    selectedMealType = t;
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.innerText === t));
    document.getElementById('selected-meal-label').innerText = t;
}

function salvaPasto() {
    if(!selectedMealType) return alert("Seleziona il pasto!");
    const q = document.getElementById('qty').value;
    const e = calcolaValori(tempFood, q);
    e.t = selectedMealType;
    if(!log[activeDate]) log[activeDate] = { k:0, p:0, c:0, g:0, fe:0, ca:0, b12:0, items: [] };
    aggiornaTotali(log[activeDate], e, 1);
    log[activeDate].items.push(e);
    localStorage.setItem('nv_log', JSON.stringify(log));
    document.getElementById('add-panel').style.display = 'none';
    refresh(); renderCalendar();
}

// --- LOGICA RICETTE ---

function aggiungiIngredienteRicetta() {
    const q = document.getElementById('recipe-qty').value;
    const e = calcolaValori(tempRecipeFood, q);
    aggiornaTotali(currentRecipe, e, 1);
    currentRecipe.items.push(e);
    renderCurrentRecipe();
    document.getElementById('recipe-add-panel').style.display = 'none';
    document.getElementById('recipe-food-search').value = "";
}

function renderCurrentRecipe() {
    const l = document.getElementById('current-recipe-items'); l.innerHTML = "";
    currentRecipe.items.forEach((i, idx) => {
        l.innerHTML += `<li>${i.n} (${Math.round(i.k)} kcal) <button onclick="rimuoviIngredienteRicetta(${idx})">×</button></li>`;
    });
    const summary = document.getElementById('recipe-summary');
    if(currentRecipe.items.length > 0) {
        summary.style.display = 'block';
        document.getElementById('recipe-totals-text').innerHTML = `
            Kcal: ${Math.round(currentRecipe.k)} | P: ${currentRecipe.p.toFixed(1)}g | C: ${currentRecipe.c.toFixed(1)}g | F: ${currentRecipe.g.toFixed(1)}g<br>
            Fe: ${currentRecipe.fe.toFixed(1)}mg | Ca: ${Math.round(currentRecipe.ca)}mg | B12: ${currentRecipe.b12.toFixed(1)}µg
        `;
    } else summary.style.display = 'none';
}

function rimuoviIngredienteRicetta(idx) {
    aggiornaTotali(currentRecipe, currentRecipe.items[idx], -1);
    currentRecipe.items.splice(idx, 1);
    renderCurrentRecipe();
}

function salvaRicettaDefinitiva() {
    const nome = document.getElementById('recipe-name').value;
    if(!nome || currentRecipe.items.length === 0) return alert("Inserisci nome e almeno un ingrediente!");
    recipes.push({ nome: nome, dati: JSON.parse(JSON.stringify(currentRecipe)) });
    localStorage.setItem('nv_recipes', JSON.stringify(recipes));
    // Reset
    currentRecipe = { k:0, p:0, c:0, g:0, fe:0, ca:0, b12:0, items: [] };
    document.getElementById('recipe-name').value = "";
    renderCurrentRecipe(); renderRecipes();
}

function renderRecipes() {
    const list = document.getElementById('preset-list'); list.innerHTML = "";
    recipes.forEach((r, idx) => {
        list.innerHTML += `<li>
            <div><strong>${r.nome}</strong><br><small>${Math.round(r.dati.k)} kcal</small></div>
            <div>
                <button onclick="applicaRicettaAlDiario(${idx})" class="btn-green" style="width:auto; padding:5px 10px;">Aggiungi a oggi</button>
                <button onclick="eliminaRicetta(${idx})" style="background:none; border:none; color:red; cursor:pointer; margin-left:10px;">Elimina</button>
            </div>
        </li>`;
    });
}

function applicaRicettaAlDiario(idx) {
    if(!selectedMealType) return alert("Seleziona prima il tipo di pasto (Colazione, Pranzo...) nel tab DIARIO");
    const r = recipes[idx].dati;
    const e = { ...r, n: recipes[idx].nome, t: selectedMealType };
    if(!log[activeDate]) log[activeDate] = { k:0, p:0, c:0, g:0, fe:0, ca:0, b12:0, items: [] };
    aggiornaTotali(log[activeDate], e, 1);
    log[activeDate].items.push(e);
    localStorage.setItem('nv_log', JSON.stringify(log));
    alert("Ricetta aggiunta al diario!");
    refresh();
}

function eliminaRicetta(idx) {
    recipes.splice(idx, 1);
    localStorage.setItem('nv_recipes', JSON.stringify(recipes));
    renderRecipes();
}

// --- UTILS ---

function calcolaValori(food, q) {
    return {
        n: food.n, k: (food.k*q)/100, p: (food.p*q)/100, c: (food.c*q)/100, g: (food.g*q)/100,
        fe: (food.fe*q)/100, ca: (food.ca*q)/100, b12: (food.b12*q)/100
    };
}

function aggiornaTotali(target, source, sign) {
    target.k += (source.k * sign); target.p += (source.p * sign);
    target.c += (source.c * sign); target.g += (source.g * sign);
    target.fe += (source.fe * sign); target.ca += (source.ca * sign);
    target.b12 += (source.b12 * sign);
}

function refresh() {
    const d = log[activeDate] || { k:0, p:0, c:0, g:0, fe:0, ca:0, b12:0, items:[] };
    const t = currentUser.target;
    document.getElementById('kcalLeft').innerText = Math.max(0, Math.round(t - d.k));
    document.getElementById('val-p').innerText = Math.round(d.p)+'g';
    document.getElementById('val-c').innerText = Math.round(d.c)+'g';
    document.getElementById('val-g').innerText = Math.round(d.g)+'g';
    
    document.getElementById('bar-ferro').style.width = Math.min(100, (d.fe/14)*100) + '%';
    document.getElementById('txt-fe').innerText = `${d.fe.toFixed(1)}/14mg`;
    document.getElementById('bar-calcio').style.width = Math.min(100, (d.ca/1000)*100) + '%';
    document.getElementById('txt-ca').innerText = `${Math.round(d.ca)}/1000mg`;
    document.getElementById('bar-b12').style.width = Math.min(100, (d.b12/2.4)*100) + '%';
    document.getElementById('txt-b12').innerText = `${d.b12.toFixed(1)}/2.4µg`;

    const ctx = document.getElementById('mainChart').getContext('2d');
    if(chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [d.p*4, d.c*4, d.g*9, Math.max(0, t-d.k)],
                backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#f0f0f0'],
                borderWidth: 0
            }]
        },
        options: { cutout: '85%', plugins: { legend: { display: false } } }
    });

    const l = document.getElementById('day-log-list'); l.innerHTML = "";
    document.getElementById('date-title-pretty').innerText = new Date(activeDate).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });
    d.items.forEach((i, idx) => {
        l.innerHTML += `<li><div><small>${i.t}</small><br>${i.n}</div><b>${Math.round(i.k)} kcal</b><button onclick="rimuoviPasto(${idx})">×</button></li>`;
    });
}

function rimuoviPasto(idx) {
    aggiornaTotali(log[activeDate], log[activeDate].items[idx], -1);
    log[activeDate].items.splice(idx, 1);
    localStorage.setItem('nv_log', JSON.stringify(log));
    refresh(); renderCalendar();
}

function mostraSezione(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}
function cambiaMese(dir) { currentCalDate.setMonth(currentCalDate.getMonth() + dir); renderCalendar(); }
function logout() { localStorage.clear(); location.reload(); }