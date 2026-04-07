const datiAlimenti = String.raw`
1) Bresaola di Tacchino: 110 kcal, 1,5 g grassi, 0,5 g grassi saturi, 1,0 g carboidrati, 0,8 g zuccheri, 0 g fibre, 23,0 g proteine, 3,50 g sale.
2) Culatello (di Zibello): 225 kcal, 12,5 g grassi, 4,2 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 28,0 g proteine, 4,00 g sale.
4) Prosciutto Cotto Alta QualitÃ : 130 kcal, 5,0 g grassi, 1,8 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 20,0 g proteine, 2,00 g sale.
5) Prosciutto Cotto Scelto: 145 kcal, 7,5 g grassi, 2,5 g grassi saturi, 1,5 g carboidrati, 1,2 g zuccheri, 0 g fibre, 18,0 g proteine, 2,20 g sale.
6) Prosciutto Cotto di Praga (affumicato): 155 kcal, 8,5 g grassi, 3,0 g grassi saturi, 1,0 g carboidrati, 0,8 g zuccheri, 0 g fibre, 19,0 g proteine, 2,30 g sale.
7) Fesa di Tacchino Arrosto: 105 kcal, 1,5 g grassi, 0,5 g grassi saturi, 1,5 g carboidrati, 1,0 g zuccheri, 0 g fibre, 21,5 g proteine, 2,10 g sale.
9) Carpaccio di Manzo (confezionato/salume): 120 kcal, 3,0 g grassi, 1,2 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 22,5 g proteine, 2,50 g sale.
10) Salame Milano: 385 kcal, 32,0 g grassi, 11,5 g grassi saturi, 1,5 g carboidrati, 1,0 g zuccheri, 0 g fibre, 23,0 g proteine, 3,80 g sale.
11) Salame Ungherese: 405 kcal, 35,0 g grassi, 12,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 21,5 g proteine, 4,00 g sale.
12) Salame Felino IGP: 365 kcal, 29,0 g grassi, 10,0 g grassi saturi, 0,5 g carboidrati, 0,2 g zuccheri, 0 g fibre, 25,5 g proteine, 3,50 g sale.
13) Salame Piccante (tipo Napoli/Calabrese): 410 kcal, 36,0 g grassi, 13,0 g grassi saturi, 1,8 g carboidrati, 1,0 g zuccheri, 0 g fibre, 20,0 g proteine, 4,20 g sale.
14) Salame di Mugnano: 390 kcal, 33,0 g grassi, 12,0 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 22,0 g proteine, 3,90 g sale.
15) Cacciatorino (Salamini Italiani alla Cacciatora DOP): 415 kcal, 35,5 g grassi, 13,0 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 23,0 g proteine, 4,10 g sale.
16) Chorizo (salame spagnolo alla paprica): 450 kcal, 38,0 g grassi, 14,0 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0,5 g fibre, 24,0 g proteine, 3,50 g sale.
18) Mortadella Bologna IGP: 288 kcal, 25,0 g grassi, 9,0 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 15,5 g proteine, 2,20 g sale.
19) Mortadella di Pollo/Tacchino: 175 kcal, 11,0 g grassi, 3,8 g grassi saturi, 3,0 g carboidrati, 1,5 g zuccheri, 0 g fibre, 16,0 g proteine, 2,40 g sale.
20) Pancetta Arrotolata: 455 kcal, 45,0 g grassi, 16,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 12,5 g proteine, 3,50 g sale.
21) Pancetta Affumicata (Bacon): 470 kcal, 47,0 g grassi, 17,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 11,5 g proteine, 4,00 g sale.
22) Guanciale (stagionato): 655 kcal, 70,0 g grassi, 25,0 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 6,5 g proteine, 3,00 g sale.
23) Lardo di Colonnata IGP: 890 kcal, 98,0 g grassi, 35,0 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 1,5 g proteine, 2,50 g sale.
24) Coppa (Capocollo): 395 kcal, 32,0 g grassi, 11,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 26,0 g proteine, 4,50 g sale.
25) Zampone di Modena IGP (cotto): 320 kcal, 26,0 g grassi, 9,5 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 0 g fibre, 21,0 g proteine, 2,10 g sale.
26) Cotechino di Modena IGP (cotto): 310 kcal, 25,0 g grassi, 9,0 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 0 g fibre, 21,0 g proteine, 2,00 g sale.
27) Gocciole Chocolate (Pavesi): 486 kcal, 22,0 g grassi, 6,2 g grassi saturi, 62,2 g carboidrati, 24,0 g zuccheri, 4,4 g fibre, 7,5 g proteine, 0,53 g sale.
28) Pan di Stelle (Mulino Bianco): 483 kcal, 20,5 g grassi, 7,8 g grassi saturi, 65,0 g carboidrati, 23,5 g zuccheri, 4,0 g fibre, 7,5 g proteine, 0,48 g sale.
29) Macine (Mulino Bianco): 482 kcal, 20,0 g grassi, 3,3 g grassi saturi, 68,0 g carboidrati, 19,0 g zuccheri, 2,8 g fibre, 6,0 g proteine, 0,83 g sale.
30) Oro Saiwa (Saiwa): 417 kcal, 8,3 g grassi, 0,8 g grassi saturi, 76,0 g carboidrati, 20,0 g zuccheri, 3,4 g fibre, 8,3 g proteine, 0,62 g sale.
31) GranTurchese (Colussi): 454 kcal, 14,0 g grassi, 1,6 g grassi saturi, 72,0 g carboidrati, 26,0 g zuccheri, 2,4 g fibre, 8,7 g proteine, 0,63 g sale.
32) Galletti (Mulino Bianco): 474 kcal, 18,2 g grassi, 1,9 g grassi saturi, 68,5 g carboidrati, 19,5 g zuccheri, 3,0 g fibre, 7,5 g proteine, 0,73 g sale.
33) Tarallucci (Mulino Bianco): 471 kcal, 18,5 g grassi, 2,0 g grassi saturi, 67,5 g carboidrati, 20,5 g zuccheri, 3,0 g fibre, 7,0 g proteine, 0,68 g sale.
34) Bucaneve (Doria): 465 kcal, 16,5 g grassi, 8,3 g grassi saturi, 70,7 g carboidrati, 23,5 g zuccheri, 2,5 g fibre, 7,1 g proteine, 0,65 g sale.
35) Abbracci (Mulino Bianco): 485 kcal, 21,5 g grassi, 10,2 g grassi saturi, 63,5 g carboidrati, 24,0 g zuccheri, 3,3 g fibre, 7,2 g proteine, 0,63 g sale.
36) Campagnole (Mulino Bianco): 468 kcal, 17,5 g grassi, 3,0 g grassi saturi, 68,5 g carboidrati, 19,5 g zuccheri, 3,5 g fibre, 7,3 g proteine, 0,78 g sale.
37) Ringo Vaniglia (Pavesi): 486 kcal, 21,0 g grassi, 9,5 g grassi saturi, 67,0 g carboidrati, 31,0 g zuccheri, 2,5 g fibre, 6,0 g proteine, 0,45 g sale.
38) Baiocchi (Mulino Bianco): 511 kcal, 26,0 g grassi, 10,5 g grassi saturi, 59,5 g carboidrati, 25,0 g zuccheri, 3,5 g fibre, 7,5 g proteine, 0,45 g sale.
39) Krumiri (Bistefani): 475 kcal, 19,0 g grassi, 10,0 g grassi saturi, 68,0 g carboidrati, 24,0 g zuccheri, 2,0 g fibre, 7,0 g proteine, 0,55 g sale.
40) Batticuori (Mulino Bianco): 472 kcal, 19,0 g grassi, 8,8 g grassi saturi, 65,7 g carboidrati, 23,5 g zuccheri, 4,5 g fibre, 7,3 g proteine, 0,50 g sale.
42) Rigoli (Mulino Bianco): 463 kcal, 16,0 g grassi, 1,5 g grassi saturi, 70,5 g carboidrati, 21,5 g zuccheri, 3,0 g fibre, 7,5 g proteine, 0,70 g sale.
43) Nascondini (Mulino Bianco): 480 kcal, 21,0 g grassi, 10,0 g grassi saturi, 63,4 g carboidrati, 24,0 g zuccheri, 3,3 g fibre, 7,6 g proteine, 0,48 g sale.
44) Molinetto (Mulino Bianco): 482 kcal, 20,5 g grassi, 5,5 g grassi saturi, 65,0 g carboidrati, 22,0 g zuccheri, 3,5 g fibre, 7,5 g proteine, 0,75 g sale.
45) Spicchi di Sole (Mulino Bianco): 472 kcal, 18,5 g grassi, 1,9 g grassi saturi, 68,0 g carboidrati, 19,5 g zuccheri, 3,5 g fibre, 7,0 g proteine, 0,73 g sale.
46) Pannocchie (Mulino Bianco): 471 kcal, 18,5 g grassi, 1,9 g grassi saturi, 67,5 g carboidrati, 20,5 g zuccheri, 4,0 g fibre, 6,5 g proteine, 0,78 g sale.
47) Buongrano (Mulino Bianco): 464 kcal, 18,5 g grassi, 1,9 g grassi saturi, 63,5 g carboidrati, 21,0 g zuccheri, 6,5 g fibre, 7,5 g proteine, 0,70 g sale.
48) Cuor di Mela (Mulino Bianco): 427 kcal, 15,0 g grassi, 7,3 g grassi saturi, 66,2 g carboidrati, 31,5 g zuccheri, 2,8 g fibre, 5,5 g proteine, 0,33 g sale.
49) Primizie (Mulino Bianco): 470 kcal, 18,5 g grassi, 1,9 g grassi saturi, 67,2 g carboidrati, 19,5 g zuccheri, 4,0 g fibre, 6,8 g proteine, 0,75 g sale.
50) Ritornelli (Mulino Bianco): 479 kcal, 20,0 g grassi, 5,3 g grassi saturi, 66,0 g carboidrati, 25,0 g zuccheri, 3,3 g fibre, 7,0 g proteine, 0,53 g sale.
idrati, 25,0 g zuccheri, 3,3 g fibre, 7,0 g proteine, 0,53 g sale.
51) Scacchieri (Mulino Bianco): 485 kcal, 22,0 g grassi, 9,8 g grassi saturi, 62,5 g carboidrati, 23,0 g zuccheri, 3,5 g fibre, 7,5 g proteine, 0,45 g sale.
52) Osvego (Gentilini): 450 kcal, 13,8 g grassi, 8,5 g grassi saturi, 71,5 g carboidrati, 22,0 g zuccheri, 3,0 g fibre, 8,5 g proteine, 0,65 g sale.
53) Novellini (Gentilini): 465 kcal, 16,5 g grassi, 11,0 g grassi saturi, 70,0 g carboidrati, 25,5 g zuccheri, 2,0 g fibre, 8,0 g proteine, 0,55 g sale.
54) Marie (Saiwa): 435 kcal, 11,0 g grassi, 1,2 g grassi saturi, 74,0 g carboidrati, 21,0 g zuccheri, 3,0 g fibre, 8,5 g proteine, 0,85 g sale.
55) Nocciolini (Lazzaroni): 460 kcal, 17,0 g grassi, 2,0 g grassi saturi, 69,0 g carboidrati, 30,0 g zuccheri, 2,5 g fibre, 6,5 g proteine, 0,60 g sale.
56) Oswego (Colussi): 440 kcal, 12,0 g grassi, 1,3 g grassi saturi, 73,0 g carboidrati, 21,0 g zuccheri, 3,0 g fibre, 8,5 g proteine, 0,70 g sale.
57) Zuppalatte (Colussi): 436 kcal, 10,0 g grassi, 1,1 g grassi saturi, 77,0 g carboidrati, 22,0 g zuccheri, 2,5 g fibre, 8,0 g proteine, 0,85 g sale.
58) Frollini con Gocce Cioccolato (Esselunga): 480 kcal, 21,0 g grassi, 10,5 g grassi saturi, 64,0 g carboidrati, 24,0 g zuccheri, 3,5 g fibre, 6,8 g proteine, 0,55 g sale.
59) Biscotti della Salute (Monviso): 405 kcal, 6,5 g grassi, 0,8 g grassi saturi, 74,0 g carboidrati, 15,0 g zuccheri, 6,0 g fibre, 10,0 g proteine, 0,40 g sale.
61) Grancereale Classico (Mulino Bianco): 466 kcal, 19,0 g grassi, 2,0 g grassi saturi, 61,5 g carboidrati, 17,5 g zuccheri, 10,0 g fibre, 8,0 g proteine, 0,75 g sale.
62) Grancereale Croccante (Mulino Bianco): 474 kcal, 20,5 g grassi, 2,2 g grassi saturi, 61,0 g carboidrati, 19,0 g zuccheri, 9,0 g fibre, 7,0 g proteine, 0,65 g sale.
63) Grancereale Cioccolato (Mulino Bianco): 477 kcal, 21,0 g grassi, 4,5 g grassi saturi, 60,0 g carboidrati, 21,0 g zuccheri, 9,5 g fibre, 7,5 g proteine, 0,70 g sale.
64) Grancereale Frutta (Mulino Bianco): 457 kcal, 17,5 g grassi, 1,8 g grassi saturi, 64,0 g carboidrati, 23,0 g zuccheri, 8,5 g fibre, 6,5 g proteine, 0,65 g sale.
65) Privolat Gocce Cioccolato (Misura): 458 kcal, 17,0 g grassi, 4,6 g grassi saturi, 67,0 g carboidrati, 22,0 g zuccheri, 4,5 g fibre, 7,0 g proteine, 0,55 g sale.
66) Fibrextra Integrale (Misura): 434 kcal, 15,0 g grassi, 1,5 g grassi saturi, 60,0 g carboidrati, 18,0 g zuccheri, 14,0 g fibre, 8,0 g proteine, 0,75 g sale.
67) Dolcesenza Senza Zuccheri (Misura): 433 kcal, 15,0 g grassi, 1,6 g grassi saturi, 70,0 g carboidrati, 1,0 g zuccheri, 5,5 g fibre, 8,5 g proteine, 0,80 g sale.
68) Multigrain (Kellogg's): 446 kcal, 15,0 g grassi, 1,8 g grassi saturi, 66,0 g carboidrati, 19,0 g zuccheri, 7,5 g fibre, 8,0 g proteine, 0,55 g sale.
69) Pavesini Classici (Pavesi): 392 kcal, 3,5 g grassi, 1,1 g grassi saturi, 81,3 g carboidrati, 48,0 g zuccheri, 2,3 g fibre, 7,8 g proteine, 0,50 g sale.
70) Magretti (Galbusera): 416 kcal, 9,5 g grassi, 1,0 g grassi saturi, 72,0 g carboidrati, 21,5 g zuccheri, 4,0 g fibre, 8,5 g proteine, 0,75 g sale.
71) Turchese PiÃ¹ Integrale (Colussi): 445 kcal, 14,5 g grassi, 1,5 g grassi saturi, 65,0 g carboidrati, 20,0 g zuccheri, 9,0 g fibre, 9,0 g proteine, 0,60 g sale.
73) Oreo Original (Nabisco): 474 kcal, 19,0 g grassi, 5,2 g grassi saturi, 68,0 g carboidrati, 38,0 g zuccheri, 2,7 g fibre, 5,4 g proteine, 0,74 g sale.
74) Oreo Golden (Nabisco): 482 kcal, 20,0 g grassi, 5,5 g grassi saturi, 69,0 g carboidrati, 36,0 g zuccheri, 1,2 g fibre, 4,8 g proteine, 0,55 g sale.
75) Loacker Wafer Napolitaner: 511 kcal, 25,0 g grassi, 21,0 g grassi saturi, 61,0 g carboidrati, 30,0 g zuccheri, 3,5 g fibre, 8,0 g proteine, 0,35 g sale.
76) Nutella Biscuits (Ferrero): 513 kcal, 24,5 g grassi, 11,8 g grassi saturi, 63,3 g carboidrati, 34,7 g zuccheri, 3,4 g fibre, 6,3 g proteine, 0,53 g sale.
77) Kinder Cards (Ferrero): 510 kcal, 25,8 g grassi, 15,2 g grassi saturi, 55,5 g carboidrati, 38,0 g zuccheri, 1,5 g fibre, 12,8 g proteine, 0,42 g sale.
78) Mikado Latte (Mondelez): 481 kcal, 19,0 g grassi, 11,0 g grassi saturi, 68,0 g carboidrati, 35,0 g zuccheri, 3,1 g fibre, 7,3 g proteine, 0,70 g sale.
79) Lotus Biscoff (Lotus): 484 kcal, 19,0 g grassi, 8,0 g grassi saturi, 72,6 g carboidrati, 38,1 g zuccheri, 1,3 g fibre, 4,9 g proteine, 0,92 g sale.
80) GrisbÃ¬ Cioccolato (Vicenzi): 534 kcal, 31,0 g grassi, 13,0 g grassi saturi, 56,0 g carboidrati, 30,0 g zuccheri, 3,5 g fibre, 6,0 g proteine, 0,45 g sale.
81) GrisbÃ¬ Nocciola (Vicenzi): 540 kcal, 32,0 g grassi, 14,0 g grassi saturi, 55,0 g carboidrati, 28,0 g zuccheri, 2,5 g fibre, 6,5 g proteine, 0,40 g sale.
82) Krumiri con Gocce (Bistefani): 485 kcal, 21,0 g grassi, 11,5 g grassi saturi, 66,0 g carboidrati, 26,0 g zuccheri, 2,5 g fibre, 6,8 g proteine, 0,50 g sale.
83) Togo Latte (Pavesi): 508 kcal, 24,5 g grassi, 14,5 g grassi saturi, 64,5 g carboidrati, 35,5 g zuccheri, 2,5 g fibre, 6,0 g proteine, 0,45 g sale.
84) Wafer Classic Cacao (Loacker): 513 kcal, 25,0 g grassi, 21,0 g grassi saturi, 60,0 g carboidrati, 26,0 g zuccheri, 4,5 g fibre, 8,5 g proteine, 0,38 g sale.
85) Biscotti Digestive (McVitie's): 483 kcal, 21,3 g grassi, 10,1 g grassi saturi, 62,8 g carboidrati, 15,1 g zuccheri, 3,8 g fibre, 6,9 g proteine, 1,3 g sale.
86) Digestive ai Frutti Rossi (McVitie's): 472 kcal, 19,5 g grassi, 9,2 g grassi saturi, 65,0 g carboidrati, 20,5 g zuccheri, 4,5 g fibre, 6,5 g proteine, 1,1 g sale.
87) Digestive al Cioccolato al Latte (McVitie's): 493 kcal, 23,6 g grassi, 12,3 g grassi saturi, 61,7 g carboidrati, 28,5 g zuccheri, 3,0 g fibre, 6,7 g proteine, 0,94 g sale.
89) Plasmon (Biscotto dei bambini): 412 kcal, 8,0 g grassi, 3,5 g grassi saturi, 75,0 g carboidrati, 23,0 g zuccheri, 2,5 g fibre, 8,8 g proteine, 0,50 g sale.
90) Mellin (Biscotto primi mesi): 410 kcal, 8,2 g grassi, 3,7 g grassi saturi, 74,5 g carboidrati, 22,5 g zuccheri, 2,0 g fibre, 9,0 g proteine, 0,45 g sale.
91) Humana (Biscotto biologico): 415 kcal, 8,5 g grassi, 4,0 g grassi saturi, 73,0 g carboidrati, 21,0 g zuccheri, 2,2 g fibre, 9,5 g proteine, 0,40 g sale.
92) Biscotto Coop (linea Crescendo): 408 kcal, 7,5 g grassi, 3,2 g grassi saturi, 76,0 g carboidrati, 24,0 g zuccheri, 2,0 g fibre, 8,5 g proteine, 0,55 g sale.
93) Ami di Pane (Pavesi): 425 kcal, 9,0 g grassi, 1,2 g grassi saturi, 78,0 g carboidrati, 22,0 g zuccheri, 3,0 g fibre, 7,5 g proteine, 0,80 g sale.
94) Pavesini al Cacao (Pavesi): 388 kcal, 3,8 g grassi, 1,3 g grassi saturi, 79,0 g carboidrati, 45,0 g zuccheri, 3,5 g fibre, 8,0 g proteine, 0,48 g sale.
95) Magretti Gocce Cioccolato (Galbusera): 428 kcal, 11,0 g grassi, 2,5 g grassi saturi, 70,0 g carboidrati, 23,0 g zuccheri, 5,0 g fibre, 9,0 g proteine, 0,70 g sale.
97) Cantuccini alla Mandorla (Sapori): 450 kcal, 15,0 g grassi, 3,0 g grassi saturi, 68,0 g carboidrati, 35,0 g zuccheri, 4,5 g fibre, 9,0 g proteine, 0,15 g sale.
98) Amaretti di Saronno (Lazzaroni): 433 kcal, 10,5 g grassi, 1,0 g grassi saturi, 77,0 g carboidrati, 75,0 g zuccheri, 3,0 g fibre, 6,5 g proteine, 0,10 g sale.
99) Savoiardi (Vicenzi): 378 kcal, 3,8 g grassi, 1,1 g grassi saturi, 76,5 g carboidrati, 42,0 g zuccheri, 2,0 g fibre, 8,5 g proteine, 0,22 g sale.
100) Lingue di Gatto (Vicenzi): 460 kcal, 15,0 g grassi, 9,0 g grassi saturi, 72,0 g carboidrati, 38,0 g zuccheri, 1,5 g fibre, 8,5 g proteine, 0,35 g sale.
101) Ricciarelli di Siena (Sapori): 445 kcal, 22,0 g grassi, 2,0 g grassi saturi, 50,0 g carboidrati, 48,0 g zuccheri, 6,0 g fibre, 9,5 g proteine, 0,05 g sale.
102) Canestrelli (Vicenzi): 520 kcal, 28,0 g grassi, 18,0 g grassi saturi, 60,0 g carboidrati, 22,0 g zuccheri, 2,0 g fibre, 6,5 g proteine, 0,30 g sale.
103) Baci di Dama (Artigianali/GDO): 550 kcal, 35,0 g grassi, 15,0 g grassi saturi, 52,0 g carboidrati, 28,0 g zuccheri, 3,0 g fibre, 7,5 g proteine, 0,10 g sale.
104) Torcetti al Burro (Monviso): 495 kcal, 22,0 g grassi, 14,0 g grassi saturi, 68,0 g carboidrati, 25,0 g zuccheri, 2,0 g fibre, 6,5 g proteine, 0,45 g sale.
106) Colussi Senza Zuccheri Aggiunti: 430 kcal, 14,0 g grassi, 1,5 g grassi saturi, 70,0 g carboidrati, 0,5 g zuccheri, 6,0 g fibre, 9,5 g proteine, 0,75 g sale.
107) Misura Fibrextra Miele: 438 kcal, 15,5 g grassi, 1,6 g grassi saturi, 61,0 g carboidrati, 19,0 g zuccheri, 13,0 g fibre, 8,2 g proteine, 0,72 g sale.
108) Galbusera BuoniCosÃ¬ (Senza Zucchero): 435 kcal, 16,0 g grassi, 1,8 g grassi saturi, 68,0 g carboidrati, 1,0 g zuccheri, 6,5 g fibre, 8,0 g proteine, 0,85 g sale.
109) Galbusera RisosuRiso: 455 kcal, 15,0 g grassi, 1,7 g grassi saturi, 70,0 g carboidrati, 20,0 g zuccheri, 4,5 g fibre, 8,5 g proteine, 0,80 g sale.
110) Zerograno Frollini (Galbusera - Senza Glutine): 465 kcal, 18,0 g grassi, 8,5 g grassi saturi, 70,0 g carboidrati, 20,0 g zuccheri, 3,0 g fibre, 4,5 g proteine, 0,60 g sale.
111) BioSottile (Probios): 410 kcal, 9,5 g grassi, 1,2 g grassi saturi, 72,0 g carboidrati, 18,0 g zuccheri, 5,5 g fibre, 8,5 g proteine, 0,50 g sale.
112) Sfornatini Integrali (Mulino Bianco): 440 kcal, 15,0 g grassi, 1,6 g grassi saturi, 63,0 g carboidrati, 18,5 g zuccheri, 10,0 g fibre, 8,5 g proteine, 0,95 g sale.
114) Frollini con Nocciole (Esselunga Top): 505 kcal, 26,0 g grassi, 12,0 g grassi saturi, 58,0 g carboidrati, 25,0 g zuccheri, 3,5 g fibre, 8,0 g proteine, 0,40 g sale.
115) Shortbread (Walkers): 533 kcal, 30,3 g grassi, 18,9 g grassi saturi, 58,4 g carboidrati, 16,2 g zuccheri, 2,1 g fibre, 5,6 g proteine, 0,70 g sale.
116) Choco Leibniz (Bahlsen): 491 kcal, 22,0 g grassi, 14,0 g grassi saturi, 64,0 g carboidrati, 35,0 g zuccheri, 2,8 g fibre, 7,8 g proteine, 0,48 g sale.
117) Pick Up! (Bahlsen): 511 kcal, 26,0 g grassi, 15,0 g grassi saturi, 61,0 g carboidrati, 35,0 g zuccheri, 2,5 g fibre, 6,7 g proteine, 0,45 g sale.
118) Oreo Double Stuff: 502 kcal, 25,0 g grassi, 7,5 g grassi saturi, 65,0 g carboidrati, 45,0 g zuccheri, 1,5 g fibre, 3,8 g proteine, 0,60 g sale.
119) Milka Sensations (Choco Inside): 510 kcal, 27,0 g grassi, 13,0 g grassi saturi, 60,0 g carboidrati, 38,0 g zuccheri, 1,8 g fibre, 5,3 g proteine, 0,85 g sale.
120) Cookie Classico (McEnnedy/Lidl): 495 kcal, 24,0 g grassi, 12,0 g grassi saturi, 62,0 g carboidrati, 34,0 g zuccheri, 3,0 g fibre, 6,0 g proteine, 0,65 g sale.
121) GrisbÃ¬ al Limone (Vicenzi): 530 kcal, 30,0 g grassi, 13,0 g grassi saturi, 58,0 g carboidrati, 31,0 g zuccheri, 2,0 g fibre, 5,5 g proteine, 0,45 g sale.
122) Knoten (Biscotti al burro danesi): 505 kcal, 25,0 g grassi, 16,0 g grassi saturi, 64,0 g carboidrati, 24,0 g zuccheri, 1,5 g fibre, 5,5 g proteine, 0,50 g sale.
124) Settembrini (Mulino Bianco): 431 kcal, 15,0 g grassi, 7,0 g grassi saturi, 66,5 g carboidrati, 33,0 g zuccheri, 3,3 g fibre, 5,8 g proteine, 0,40 g sale.
125) Tenerezze al Limone (Mulino Bianco): 470 kcal, 20,0 g grassi, 9,5 g grassi saturi, 66,5 g carboidrati, 25,5 g zuccheri, 1,8 g fibre, 5,2 g proteine, 0,45 g sale.
126) Gemme di Albicocca (Mulino Bianco): 435 kcal, 16,0 g grassi, 7,5 g grassi saturi, 66,0 g carboidrati, 32,0 g zuccheri, 2,5 g fibre, 5,5 g proteine, 0,42 g sale.
127) Cioccograno (Mulino Bianco): 475 kcal, 20,5 g grassi, 9,0 g grassi saturi, 62,0 g carboidrati, 21,5 g zuccheri, 6,2 g fibre, 7,5 g proteine, 0,65 g sale.
128) Rigoli Integrali (Mulino Bianco): 450 kcal, 16,0 g grassi, 1,6 g grassi saturi, 64,0 g carboidrati, 19,0 g zuccheri, 9,5 g fibre, 8,0 g proteine, 0,75 g sale.
129) Ringo Cacao (Pavesi): 488 kcal, 21,5 g grassi, 9,8 g grassi saturi, 66,0 g carboidrati, 32,0 g zuccheri, 3,0 g fibre, 6,2 g proteine, 0,48 g sale.
130) Togo Fondente (Pavesi): 505 kcal, 25,0 g grassi, 15,0 g grassi saturi, 62,0 g carboidrati, 33,0 g zuccheri, 4,0 g fibre, 6,5 g proteine, 0,40 g sale.
131) Marie Integrali (Saiwa): 425 kcal, 11,5 g grassi, 1,2 g grassi saturi, 68,0 g carboidrati, 19,0 g zuccheri, 10,0 g fibre, 9,0 g proteine, 0,80 g sale.
132) Vitasnella Frollini ai Cereali: 435 kcal, 13,0 g grassi, 1,5 g grassi saturi, 69,0 g carboidrati, 19,0 g zuccheri, 8,0 g fibre, 8,0 g proteine, 0,75 g sale.
133) Biscottone (Mulino Bianco): 477 kcal, 19,5 g grassi, 2,5 g grassi saturi, 66,2 g carboidrati, 21,5 g zuccheri, 4,0 g fibre, 7,2 g proteine, 0,75 g sale.
134) Zenzerini (Galbusera): 445 kcal, 15,0 g grassi, 1,7 g grassi saturi, 70,0 g carboidrati, 22,0 g zuccheri, 3,5 g fibre, 7,5 g proteine, 0,80 g sale.
135) Belvita Breakfast Miele e Cereali: 450 kcal, 15,0 g grassi, 1,5 g grassi saturi, 68,0 g carboidrati, 20,0 g zuccheri, 7,0 g fibre, 7,5 g proteine, 0,40 g sale.
136) Belvita Breakfast Cioccolato: 460 kcal, 16,0 g grassi, 4,0 g grassi saturi, 66,0 g carboidrati, 25,0 g zuccheri, 6,5 g fibre, 8,0 g proteine, 0,45 g sale.
137) Biscotti Farro e Gocce (Esselunga Bio): 465 kcal, 18,0 g grassi, 8,5 g grassi saturi, 65,0 g carboidrati, 24,0 g zuccheri, 5,0 g fibre, 8,5 g proteine, 0,55 g sale.
138) Novellini al Latte e Miele (Campiello): 470 kcal, 17,0 g grassi, 8,5 g grassi saturi, 71,0 g carboidrati, 25,0 g zuccheri, 1,5 g fibre, 7,5 g proteine, 0,60 g sale.
139) Ottimini Integrali (Divella): 448 kcal, 16,5 g grassi, 2,0 g grassi saturi, 65,0 g carboidrati, 18,0 g zuccheri, 8,5 g fibre, 8,0 g proteine, 0,70 g sale.
140) Ottimini al Cacao (Divella): 465 kcal, 18,5 g grassi, 8,5 g grassi saturi, 66,0 g carboidrati, 24,0 g zuccheri, 3,5 g fibre, 7,5 g proteine, 0,65 g sale.
141) Ottimini con Gocce di Cioccolato (Divella): 475 kcal, 20,0 g grassi, 9,5 g grassi saturi, 65,0 g carboidrati, 23,0 g zuccheri, 3,0 g fibre, 7,5 g proteine, 0,60 g sale.
142) Digestive (Conad): 480 kcal, 21,0 g grassi, 10,0 g grassi saturi, 63,0 g carboidrati, 16,0 g zuccheri, 3,5 g fibre, 7,0 g proteine, 1,2 g sale.
143) Frollini ai Cereali (Carrefour Bio): 455 kcal, 17,0 g grassi, 1,8 g grassi saturi, 65,0 g carboidrati, 20,0 g zuccheri, 7,5 g fibre, 8,0 g proteine, 0,65 g sale.
144) Petit Beurre (LU): 440 kcal, 12,0 g grassi, 7,5 g grassi saturi, 74,0 g carboidrati, 23,0 g zuccheri, 2,2 g fibre, 8,0 g proteine, 0,70 g sale.
145) Bastoncini (Balocco): 468 kcal, 17,0 g grassi, 2,5 g grassi saturi, 70,0 g carboidrati, 20,0 g zuccheri, 3,5 g fibre, 7,0 g proteine, 0,75 g sale.
146) Mondine (Balocco): 472 kcal, 18,5 g grassi, 2,8 g grassi saturi, 68,0 g carboidrati, 19,5 g zuccheri, 3,5 g fibre, 7,5 g proteine, 0,80 g sale.
147) Paste di Meliga (Monviso): 510 kcal, 26,0 g grassi, 16,0 g grassi saturi, 62,0 g carboidrati, 22,0 g zuccheri, 2,5 g fibre, 6,5 g proteine, 0,40 g sale.
149) Petto di pollo: kcal 165, proteine 31.0g, grassi 3.6g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B6, Niacina, Selenio
150) Coscia di pollo (senza pelle): kcal 119, proteine 20.0g, grassi 4.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Zinco, Vitamina B12
151) Petto di tacchino: kcal 104, proteine 24.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B6, Fosforo
152) Filetto di manzo: kcal 250, proteine 26.0g, grassi 15.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro emico, Zinco, Vitamina B12
153) Girello di manzo: kcal 137, proteine 22.0g, grassi 5.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Potassio
154) Macinato di manzo (magro 5%): kcal 137, proteine 21.0g, grassi 5.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Zinco, Vitamina B3
155) Lonza di maiale: kcal 143, proteine 21.0g, grassi 6.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Tiamina (B1), Selenio
156) Braciola di maiale: kcal 197, proteine 20.0g, grassi 12.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B6, Zinco
157) Fegato di bovino: kcal 135, proteine 20.0g, grassi 3.6g, carboidrati 3.9g, fibre 0.0g, micronutrienti: Vitamina A, Ferro, Rame
158) Carne di cavallo: kcal 133, proteine 21.0g, grassi 5.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Vitamina B12
159) Bresaola: kcal 151, proteine 32.0g, grassi 2.6g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Sodio, Potassio, Ferro
160) Prosciutto crudo (magro): kcal 235, proteine 28.0g, grassi 13.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Sodio, Vitamina B1
161) Prosciutto cotto: kcal 215, proteine 20.0g, grassi 14.0g, carboidrati 1.0g, fibre 0.0g, micronutrienti: Sodio, Fosforo
162) Agnello (costolette): kcal 377, proteine 15.0g, grassi 35.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Zinco, Vitamina B12
163) Coniglio: kcal 136, proteine 33.0g, grassi 5.5g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B3, Selenio
165) Salmone (Atlantico): kcal 208, proteine 20.0g, grassi 13.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Omega-3, Vitamina D
166) Tonno (fresco): kcal 144, proteine 23.0g, grassi 4.9g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Selenio, Vitamina B12, Niacina
167) Tonno (scatola, al naturale): kcal 116, proteine 26.0g, grassi 0.8g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Fosforo, Magnesio
169) Prosciutto Crudo di Parma DOP (stagionato 18 mesi): 265 kcal, 18,5 g grassi, 6,2 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 26,0 g proteine, 4,50 g sale.
170) Prosciutto Crudo Sgrassato (solo parte magra): 175 kcal, 4,5 g grassi, 1,5 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 33,0 g proteine, 5,00 g sale.
171) Prosciutto San Daniele DOP: 272 kcal, 19,0 g grassi, 6,5 g grassi saturi, 0,1 g carboidrati, 0,1 g zuccheri, 0 g fibre, 25,5 g proteine, 4,30 g sale.
172) Speck dell'Alto Adige IGP: 300 kcal, 20,0 g grassi, 7,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 28,0 g proteine, 5,20 g sale.
173) Bresaola della Valtellina IGP (Punta d'Anca): 151 kcal, 2,0 g grassi, 0,7 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 32,0 g proteine, 3,80 g sale
174) Physalis (Alkekengi): kcal 53, proteine 1.9g, grassi 0.7g, carboidrati 11.2g, fibre 0.0g, micronutrienti: Vitamina A, Niacina
175) Platano (Verde): kcal 122, proteine 1.3g, grassi 0.4g, carboidrati 31.9g, fibre 2.3g, micronutrienti: Vitamina B6, Potassio
176) Salak (Frutto serpente): kcal 82, proteine 0.8g, grassi 0.4g, carboidrati 21.0g, fibre 0.5g, micronutrienti: Ferro, Vitamina C
177) Santu: kcal 50, proteine 0.7g, grassi 0.2g, carboidrati 13.0g, fibre 1.5g, micronutrienti: Vitamina C, Calcio
178) Spaghetti (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
179) Penne Rigate (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
180) Fusilli (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
181) Rigatoni (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
182) Farfalle (confezionati): 357 kcal, 1,5 g grassi, 0,3 g grassi saturi, 72,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 12,5 g proteine, 0,01 g sale.
183) Linguine (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
184) Mezze Maniche (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
185) Tortiglioni (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
186) Bucatini (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
187) Orecchiette secche (confezionati): 352 kcal, 1,3 g grassi, 0,3 g grassi saturi, 71,5 g carboidrati, 3,0 g zuccheri, 3,0 g fibre, 12,0 g proteine, 0,01 g sale.
188) Paccheri (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
189) Ziti (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
190) Ditalini (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
191) Stelline/Pastina (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
192) Cannelloni secchi (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
193) Lasagne secche di semola (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
194) Pasta Integrale (confezionati): 348 kcal, 2,5 g grassi, 0,5 g grassi saturi, 64,0 g carboidrati, 3,3 g zuccheri, 8,0 g fibre, 13,5 g proteine, 0,01 g sale.
195) Pasta di Farro (confezionati): 340 kcal, 2,5 g grassi, 0,4 g grassi saturi, 63,0 g carboidrati, 2,5 g zuccheri, 7,0 g fibre, 13,0 g proteine, 0,01 g sale.
196) Pasta di Kamut/Khorasan (confezionati): 357 kcal, 2,1 g grassi, 0,4 g grassi saturi, 67,0 g carboidrati, 2,8 g zuccheri, 6,5 g fibre, 14,5 g proteine, 0,01 g sale.
197) Pasta d'Orzo (confezionati): 345 kcal, 2,0 g grassi, 0,4 g grassi saturi, 68,0 g carboidrati, 2,0 g zuccheri, 6,0 g fibre, 11,0 g proteine, 0,01 g sale.
198) Pasta di Segale (confezionati): 335 kcal, 1,8 g grassi, 0,3 g grassi saturi, 66,0 g carboidrati, 2,0 g zuccheri, 12,0 g fibre, 9,5 g proteine, 0,01 g sale.
199) Pasta di Lenticchie Rosse (confezionati): 335 kcal, 1,7 g grassi, ,4 g grassi saturi, 50,0 g carboidrati, 1,5 g zuccheri, 11,0 g fibre, 25,0 g proteine, 0,01 g sale.
200) Pasta di Ceci (confezionati): 355 kcal, 4,5 g grassi, 0,6 g grassi saturi, 49,0 g carboidrati, 2,0 g zuccheri, 13,0 g fibre, 22,0 g proteine, 0,01 g sale.
201) Pasta di Piselli Verdi (confezionati): 340 kcal, 1,5 g grassi, 0,3 g grassi saturi, 54,0 g carboidrati, 2,5 g zuccheri, 10,0 g fibre, 20,0 g proteine, 0,01 g sale.
202) Pasta di Fagioli Neri (confezionati): 325 kcal, 2,5 g grassi, 0,5 g grassi saturi, 40,0 g carboidrati, 2,5 g zuccheri, 15,0 g fibre, 28,0 g proteine, 0,01 g sale.
203) Tagliatelle all'uovo secche (confezionati): 385 kcal, 4,5 g grassi, 1,5 g grassi saturi, 68,0 g carboidrati, 2,5 g zuccheri, 3,0 g fibre, 15,0 g proteine, 0,10 g sale.
204) Pappardelle all'uovo secche (confezionati): 385 kcal, 4,5 g grassi, 1,5 g grassi saturi, 68,0 g carboidrati, 2,5 g zuccheri, 3,0 g fibre, 15,0 g proteine, 0,10 g sale.
205) Fettuccine all'uovo secche (confezionati): 385 kcal, 4,5 g grassi, 1,5 g grassi saturi, 68,0 g carboidrati, 2,5 g zuccheri, 3,0 g fibre, 15,0 g proteine, 0,10 g sale.
206) Lasagne all'uovo secche (confezionati): 380 kcal, 4,0 g grassi, 1,3 g grassi saturi, 69,0 g carboidrati, 2,5 g zuccheri, 3,0 g fibre, 14,5 g proteine, 0,10 g sale.
207) Tagliatelle fresche all'uovo (confezionati/banco frigo): 285 kcal, 4,0 g grassi, 1,2 g grassi saturi, 50,0 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 11,0 g proteine, 0,20 g sale.
208) Passatelli freschi (confezionati/banco frigo): 310 kcal, 12,0 g grassi, 5,0 g grassi saturi, 32,0 g carboidrati, 1,5 g zuccheri, 1,5 g fibre, 18,0 g proteine, 1,20 g sale.
209) Tortellini alla carne (confezionati): 295 kcal, 8,5 g grassi, 3,5 g grassi saturi, 40,0 g carboidrati, 2,0 g zuccheri, 2,5 g fibre, 13,5 g proteine, 1,10 g sale.
210) Ravioli ricotta e spinaci (confezionati): 245 kcal, 7,0 g grassi, 3,8 g grassi saturi, 34,0 g carboidrati, 2,5 g zuccheri, 3,0 g fibre, 10,5 g proteine, 0,95 g sale.
211) Cappelletti al prosciutto crudo (confezionati): 305 kcal, 9,0 g grassi, 4,0 g grassi saturi, 41,0 g carboidrati, 2,0 g zuccheri, 2,5 g fibre, 14,0 g proteine, 1,20 g sale.
212) Tortelloni ai funghi porcini (confezionati): 260 kcal, 7,5 g grassi, 2,5 g grassi saturi, 38,0 g carboidrati, 2,0 g zuccheri, 3,0 g fibre, 9,0 g proteine, 1,00 g sale.
213) Ravioli al branzino/pesce (confezionati): 235 kcal, 6,5 g grassi, 2,0 g grassi saturi, 32,0 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 11,0 g proteine, 1,10 g sale.
214) Agnolotti piemontesi (confezionati): 280 kcal, 9,0 g grassi, 3,5 g grassi saturi, 35,0 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 13,5 g proteine, 1,00 g sale.
215) Culurgiones (confezionati): 220 kcal, 6,0 g grassi, 3,0 g grassi saturi, 33,0 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 7,5 g proteine, 0,90 g sale.
216) Gnocchi di patate (confezionati/freschi): 160 kcal, 0,5 g grassi, 0,1 g grassi saturi, 34,0 g carboidrati, 1,0 g zuccheri, 1,5 g fibre, 3,5 g proteine, 1,10 g sale.
217) Gnocchi di patate ripieni di formaggio (confezionati): 195 kcal, 4,5 g grassi, 2,5 g grassi saturi, 32,0 g carboidrati, 1,5 g zuccheri, 1,5 g fibre, 5,5 g proteine, 1,20 g sale.
218) Chicche di patate (confezionati): 165 kcal, 0,5 g grassi, 0,1 g grassi saturi, 35,0 g carboidrati, 1,0 g zuccheri, 1,5 g fibre, 3,5 g proteine, 1,10 g sale.
219) Gnocchi alla romana (confezionati/pronti): 185 kcal, 9,0 g grassi, 5,5 g grassi saturi, 19,0 g carboidrati, 1,5 g zuccheri, 1,0 g fibre, 6,5 g proteine, 1,30 g sale.
220) Trofie fresche (confezionati): 270 kcal, 1,0 g grassi, 0,2 g grassi saturi, 56,0 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 8,5 g proteine, 0,10 g sale.
221) Strozzapreti (confezionati): 285 kcal, 1,2 g grassi, 0,3 g grassi saturi, 58,0 g carboidrati, 1,8 g zuccheri, 2,5 g fibre, 9,0 g proteine, 0,10 g sale.
222) Cavallucci/Gnocchetti sardi secchi (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
223) Pici toscani secchi (confezionati): 350 kcal, 1,4 g grassi, 0,3 g grassi saturi, 70,0 g carboidrati, 3,0 g zuccheri, 3,0 g fibre, 12,5 g proteine, 0,01 g sale.
224) Scialatielli freschi (confezionati): 265 kcal, 1,5 g grassi, 0,4 g grassi saturi, 54,0 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 8,0 g proteine, 0,20 g sale
225) Pasta di Mais (confezionati): 360 kcal, 1,5 g grassi, 0,3 g grassi saturi, 78,0 g carboidrati, 0,5 g zuccheri, 2,0 g fibre, 7,0 g proteine, 0,01 g sale.
226) Pasta di Riso (confezionati): 355 kcal, 1,0 g grassi, 0,3 g grassi saturi, 79,0 g carboidrati, 0,2 g zuccheri, 1,5 g fibre, 7,0 g proteine, 0,01 g sale.
227) Pasta di Mais e Riso (confezionati): 358 kcal, 1,3 g grassi, 0,3 g grassi saturi, 78,5 g carboidrati, 0,4 g zuccheri, 1,8 g fibre, 7,0 g proteine, 0,01 g sale.
228) Finocchiona IGP (Toscana): 380 kcal, 32,0 g grassi, 11,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 22,0 g proteine, 4,00 g sale.
229) Soppressata di Calabria DOP: 410 kcal, 35,0 g grassi, 12,5 g grassi saturi, 1,5 g carboidrati, 0,8 g zuccheri, 0 g fibre, 22,5 g proteine, 4,20 g sale.
230) 'Nduja di Spilinga (Calabria): 520 kcal, 50,0 g grassi, 18,0 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0,5 g fibre, 15,0 g proteine, 3,50 g sale.
231) Salame Cremona IGP: 375 kcal, 30,0 g grassi, 10,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 25,0 g proteine, 3,80 g sale.
232) Salame d'Oca di Mortara IGP: 340 kcal, 28,0 g grassi, 9,5 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 20,0 g proteine, 3,20 g sale.
233) Salame di Varzi DOP: 390 kcal, 31,5 g grassi, 11,0 g grassi saturi, 0,5 g carboidrati, 0,2 g zuccheri, 0 g fibre, 26,0 g proteine, 3,60 g sale.
234) Salame Brianza DOP: 385 kcal, 31,0 g grassi, 11,0 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 25,5 g proteine, 3,70 g sale.
235) Salame Piacentino DOP: 405 kcal, 34,0 g grassi, 12,0 g grassi saturi, 0,5 g carboidrati, 0,2 g zuccheri, 0 g fibre, 24,0 g proteine, 3,90 g sale.
236) Pancetta Piacentina DOP: 460 kcal, 46,0 g grassi, 16,5 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 12,0 g proteine, 3,80 g sale.
237) Coppa Piacentina DOP: 398 kcal, 33,0 g grassi, 12,0 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 24,0 g proteine, 4,60 g sale.
238) Salame Sant'Angelo di Brolo IGP: 360 kcal, 28,0 g grassi, 9,8 g grassi saturi, 0,5 g carboidrati, 0,2 g zuccheri, 0 g fibre, 27,0 g proteine, 3,50 g sale.
239) Porchetta di Ariccia IGP: 250 kcal, 18,0 g grassi, 6,5 g grassi saturi, 1,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 20,0 g proteine, 2,20 g sale.
240) Coppa di Parma IGP: 325 kcal, 24,0 g grassi, 8,5 g grassi saturi, 0,8 g carboidrati, 0,5 g zuccheri, 0 g fibre, 26,5 g proteine, 4,40 g sale.
241) Lonzino (Lombo stagionato): 210 kcal, 9,0 g grassi, 3,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 31,0 g proteine, 4,50 g sale.
242) Pancetta tesa piccante: 480 kcal, 48,0 g grassi, 17,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 11,0 g proteine, 4,20 g sale.
243) Slinzega (tipo bresaola piccola): 180 kcal, 4,5 g grassi, 1,8 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 34,0 g proteine, 4,80 g sale.
244) Mocetta (Valle d'Aosta): 190 kcal, 5,5 g grassi, 2,2 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 34,0 g proteine, 4,50 g sale.
246) Salame di Cinghiale: 355 kcal, 26,0 g grassi, 9,0 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 28,0 g proteine, 4,10 g sale.
247) Salame di Cervo: 330 kcal, 22,0 g grassi, 8,0 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 31,0 g proteine, 4,00 g sale.
248) Salame di Capriolo: 325 kcal, 21,5 g grassi, 7,8 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 31,0 g proteine, 4,00 g sale.
249) Bresaola di Cavallo: 145 kcal, 2,5 g grassi, 1,0 g grassi saturi, 1,5 g carboidrati, 1,0 g zuccheri, 0 g fibre, 29,0 g proteine, 3,90 g sale.
250) Salame di Asino: 345 kcal, 25,0 g grassi, 8,8 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 28,0 g proteine, 4,20 g sale.
251) Violino di Capra (prosciutto di capra): 240 kcal, 14,0 g grassi, 5,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 27,5 g proteine, 4,80 g sale.
252) Prosciutto di Petto d'Anatra (affumicato): 380 kcal, 34,0 g grassi, 11,0 g grassi saturi, 1,5 g carboidrati, 1,0 g zuccheri, 0 g fibre, 17,0 g proteine, 3,50 g sale.
254) Jamon Iberico de Bellota (Spagna): 375 kcal, 28,0 g grassi, 9,5 g grassi saturi, 0,5 g carboidrati, 0 g zuccheri, 0 g fibre, 30,0 g proteine, 3,80 g sale.
255) Jamon Serrano: 240 kcal, 13,0 g grassi, 4,5 g grassi saturi, 0,5 g carboidrati, 0 g zuccheri, 0 g fibre, 30,0 g proteine, 4,50 g sale.
256) Pastrami di Manzo (affettato): 145 kcal, 6,0 g grassi, 2,5 g grassi saturi, 2,5 g carboidrati, 1,5 g zuccheri, 0 g fibre, 20,0 g proteine, 2,80 g sale.
257) Salami Pepperoni (tipo USA): 495 kcal, 44,0 g grassi, 17,0 g grassi saturi, 2,5 g carboidrati, 1,5 g zuccheri, 0 g fibre, 22,0 g proteine, 4,50 g sale.
258) Leberwurst (patÃ© di fegato in budello): 325 kcal, 28,0 g grassi, 10,0 g grassi saturi, 2,0 g carboidrati, 1,5 g zuccheri, 0 g fibre, 16,0 g proteine, 1,80 g sale.
259) SchwarzwÃ¤lder Schinken (Prosciutto Foresta Nera): 245 kcal, 14,0 g grassi, 5,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 28,5 g proteine, 5,50 g sale.
261) Bratwurst di Vitello: 260 kcal, 22,0 g grassi, 8,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 14,5 g proteine, 2,10 g sale.
262) Bratwurst di Suino: 295 kcal, 26,0 g grassi, 10,0 g grassi saturi, 1,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 13,5 g proteine, 2,20 g sale.
263) Weisswurst (Salsiccia bianca di Monaco): 255 kcal, 22,0 g grassi, 8,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 12,5 g proteine, 1,90 g sale.
264) Salsiccia fresca di Suino: 310 kcal, 27,0 g grassi, 9,8 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 16,0 g proteine, 2,20 g sale.
265) Salsiccia di Pollo e Tacchino fresca: 165 kcal, 11,0 g grassi, 3,5 g grassi saturi, 1,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 15,5 g proteine, 2,00 g sale.
266) Salsiccia di fegato: 380 kcal, 33,0 g grassi, 12,0 g grassi saturi, 2,5 g carboidrati, 1,5 g zuccheri, 0 g fibre, 18,0 g proteine, 2,10 g sale.
267) Cervellata (Salsiccia tipica pugliese): 290 kcal, 24,0 g grassi, 9,0 g grassi saturi, 1,2 g carboidrati, 0,5 g zuccheri, 0 g fibre, 17,0 g proteine, 2,30 g sale.
268) Luganega (Salsiccia lunga): 300 kcal, 25,5 g grassi, 9,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 16,5 g proteine, 2,20 g sale.
270) Bastoncini di salame (Snack tipo Mini-Salami): 510 kcal, 45,0 g grassi, 17,5 g grassi saturi, 2,0 g carboidrati, 1,5 g zuccheri, 0 g fibre, 24,0 g proteine, 4,20 g sale.
271) Beef Jerky (Manzo essiccato): 280 kcal, 4,0 g grassi, 1,8 g grassi saturi, 11,0 g carboidrati, 9,0 g zuccheri, 0 g fibre, 50,0 g proteine, 5,00 g sale.
272) Affettato Vegano (base soia/glutine): 185 kcal, 9,0 g grassi, 1,2 g grassi saturi, 5,0 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 21,0 g proteine, 2,10 g sale.
273) Fettine di Bresaola sgrassata: 148 kcal, 1,8 g grassi, 0,6 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 33,0 g proteine, 3,90 g sale.
274) Prosciutto Cotto Light (-50% grassi): 95 kcal, 2,5 g grassi, 0,9 g grassi saturi, 1,0 g carboidrati, 0,8 g zuccheri, 0 g fibre, 17,0 g proteine, 1,90 g sale.
275) Mortadella Light: 180 kcal, 12,0 g grassi, 4,2 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 16,0 g proteine, 2,10 g sale.
276) WÃ¼rstel di Suino (classico): 270 kcal, 24,0 g grassi, 9,0 g grassi saturi, 1,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 12,0 g proteine, 2,30 g sale.
277) WÃ¼rstel di Pollo e Tacchino: 220 kcal, 17,0 g grassi, 5,5 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 14,0 g proteine, 2,50 g sale.
278) WÃ¼rstel con Formaggio: 295 kcal, 26,0 g grassi, 10,5 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 13,5 g proteine, 2,40 g sale.
279) Merluzzo: kcal 82, proteine 18.0g, grassi 0.7g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Iodio, Selenio, Potassio
280) Spigola (Branzino): kcal 97, proteine 18.0g, grassi 2.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Selenio, Vitamina B6
281) Orata: kcal 115, proteine 20.0g, grassi 3.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Fosforo, Omega-3
282) Sgombro: kcal 305, proteine 19.0g, grassi 25.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina D, Vitamina B12, Omega-3
283) Sardine (fresche): kcal 208, proteine 20.0g, grassi 14.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Calcio, Ferro, Vitamina D
284) Alici (Acciughe): kcal 131, proteine 20.0g, grassi 5.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Calcio, Omega-3
285) Polpo: kcal 82, proteine 15.0g, grassi 1.0g, carboidrati 2.2g, fibre 0.0g, micronutrienti: Ferro, Selenio, Vitamina B12
286) Calamaro: kcal 92, proteine 16.0g, grassi 1.4g, carboidrati 3.1g, fibre 0.0g, micronutrienti: Rame, Zinco
287) Gamberi: kcal 99, proteine 24.0g, grassi 0.3g, carboidrati 0.2g, fibre 0.0g, micronutrienti: Selenio, Iodio
288) Cozze: kcal 172, proteine 24.0g, grassi 4.5g, carboidrati 7.4g, fibre 0.0g, micronutrienti: Manganese, Ferro emico
289) Vongole: kcal 148, proteine 26.0g, grassi 2.0g, carboidrati 5.1g, fibre 0.0g, micronutrienti: Ferro, Vitamina C
290) Ostriche: kcal 81, proteine 9.0g, grassi 2.3g, carboidrati 4.9g, fibre 0.0g, micronutrienti: Zinco (altissimo), Rame
292) Uovo di gallina (intero): kcal 155, proteine 13.0g, grassi 11.0g, carboidrati 1.1g, fibre 0.0g, micronutrienti: Colina, Vitamina A, Riboflavina
293) Albume d'uovo: kcal 52, proteine 11.0g, grassi 0.2g, carboidrati 0.7g, fibre 0.0g, micronutrienti: Selenio, Riboflavina
294) Tuorlo d'uovo: kcal 322, proteine 16.0g, grassi 27.0g, carboidrati 3.6g, fibre 0.0g, micronutrienti: Vitamina A, Vitamina D, Ferro
295) Semi di Chia: kcal 486, proteine 17.0g, grassi 31.0g, carboidrati 42.0g, fibre 34.0g, micronutrienti: Omega-3, Calcio, Manganese
296) Semi di Lino: kcal 534, proteine 18.0g, grassi 42.0g, carboidrati 29.0g, fibre 27.0g, micronutrienti: Omega-3, Magnesio
297) Semi di Zucca: kcal 559, proteine 30.0g, grassi 49.0g, carboidrati 11.0g, fibre 6.0g, micronutrienti: Zinco, Magnesio
299) Anatra (petto senza pelle): kcal 140, proteine 20.0g, grassi 6.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Rame, Vitamina B3
300) Oca (carne senza pelle): kcal 161, proteine 22.0g, grassi 7.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Selenio, Fosforo
301) Quaglia (carne magra): kcal 134, proteine 22.0g, grassi 4.5g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B6, Zinco
302) Vitello (fesa): kcal 107, proteine 21.0g, grassi 2.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B3, Potassio
303) Pancetta di maiale (tesa): kcal 418, proteine 14.0g, grassi 39.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Sodio, Selenio
304) Salame (tipo Milano): kcal 336, proteine 22.0g, grassi 27.0g, carboidrati 1.0g, fibre 0.0g, micronutrienti: Sodio, Zinco, Tiamina
305) Mortadella: kcal 311, proteine 16.0g, grassi 28.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Sodio, Vitamina B12
306) Speck: kcal 300, proteine 30.0g, grassi 20.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Potassio
307) Guanciale: kcal 655, proteine 4.0g, grassi 69.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Sodio, Grassi saturi
308) Salsiccia di maiale (fresca): kcal 346, proteine 14.0g, grassi 31.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Tiamina, Fosforo
309) Wurstel (suino): kcal 269, proteine 13.0g, grassi 23.0g, carboidrati 2.0g, fibre 0.0g, micronutrienti: Sodio, Vitamina B12
310) Trippa di bovino: kcal 94, proteine 16.0g, grassi 3.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Calcio, Vitamina B12
311) Roast beef: kcal 111, proteine 22.0g, grassi 2.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Zinco
312) Faraona: kcal 134, proteine 23.0g, grassi 4.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Vitamina B6
313) Tacchino (fesa a fette, salume): kcal 104, proteine 24.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Fosforo, Sodio
315) Pesce spada: kcal 144, proteine 20.0g, grassi 6.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina D, Selenio
316) Trota (salmonata): kcal 148, proteine 21.0g, grassi 6.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Omega-3, Vitamina B12
317) Anguilla: kcal 236, proteine 15.0g, grassi 19.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina A, Vitamina B12
318) Rana pescatrice (coda di rospo): kcal 76, proteine 14.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Fosforo, Selenio
319) Sogliola: kcal 86, proteine 15.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B3, Selenio
320) Platessa: kcal 86, proteine 15.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B12, Iodio
321) Astice: kcal 90, proteine 19.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Rame, Zinco, Selenio
322) Granchio: kcal 84, proteine 18.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Zinco, Vitamina B12
323) Scampi: kcal 85, proteine 17.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Selenio, Iodio
324) Capesante: kcal 69, proteine 12.0g, grassi 1.0g, carboidrati 3.0g, fibre 0.0g, micronutrienti: Magnesio, Potassio
325) Seppia: kcal 79, proteine 16.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Rame, Fosforo
326) Aringa: kcal 158, proteine 18.0g, grassi 9.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina D, Omega-3
327) Triglia: kcal 117, proteine 19.0g, grassi 4.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Iodio, Vitamina D
328) Carpa: kcal 127, proteine 18.0g, grassi 5.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Fosforo, Vitamina B12
329) Caviale: kcal 264, proteine 25.0g, grassi 18.0g, carboidrati 4.0g, fibre 0.0g, micronutrienti: Vitamina B12, Ferro, Magnesio
331) Pecorino Romano: kcal 387, proteine 26.0g, grassi 31.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Sodio, Calcio
333) Cuore di bovino: kcal 112, proteine 17.0g, grassi 3.9g, carboidrati 0.1g, fibre 0.0g, micronutrienti: Vitamina B12, Riboflavina, Ferro
334) Lingua di bovino: kcal 224, proteine 15.0g, grassi 16.0g, carboidrati 3.7g, fibre 0.0g, micronutrienti: Zinco, Vitamina B12
335) Rognone di bovino (rene): kcal 103, proteine 17.0g, grassi 3.0g, carboidrati 0.9g, fibre 0.0g, micronutrienti: Selenio (altissimo), Vitamina A
336) Polmone di bovino: kcal 92, proteine 16.0g, grassi 2.5g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Vitamina C
337) Cervello di bovino: kcal 143, proteine 11.0g, grassi 10.0g, carboidrati 1.5g, fibre 0.0g, micronutrienti: Colina, Vitamina B12
338) Carne di struzzo: kcal 114, proteine 25.0g, grassi 1.2g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Vitamina B12
339) Carne di cervo: kcal 120, proteine 23.0g, grassi 2.4g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Zinco, Niacina
340) Carne di cinghiale: kcal 122, proteine 21.0g, grassi 3.3g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Zinco, Selenio
341) Piccione (carne): kcal 142, proteine 17.5g, grassi 7.5g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Rame
342) Midollo osseo: kcal 786, proteine 6.7g, grassi 84.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Calcio, Fosforo
343) Animelle (timo/pancrÃ©as): kcal 240, proteine 15.0g, grassi 20.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina C, Potassio
344) Cotechino (fresco): kcal 450, proteine 17.0g, grassi 42.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Sodio, Tiamina
345) Zampone: kcal 360, proteine 19.0g, grassi 31.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Sodio, Ferro
346) Sanguinaccio: kcal 379, proteine 15.0g, grassi 34.0g, carboidrati 1.3g, fibre 0.0g, micronutrienti: Ferro, Vitamina B12
347) Carne di capra: kcal 109, proteine 20.0g, grassi 2.3g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Ferro, Potassio
349) Luccio: kcal 88, proteine 19.0g, grassi 0.7g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Fosforo, Vitamina B12
350) Persico reale: kcal 91, proteine 19.0g, grassi 0.9g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Manganese, Vitamina B12
351) Cernia: kcal 92, proteine 19.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Potassio, Selenio
352) Dentice: kcal 100, proteine 20.0g, grassi 1.7g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina A, Fosforo
353) Gallinella di mare: kcal 101, proteine 19.0g, grassi 2.3g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Potassio, Iodio
354) Razza: kcal 78, proteine 18.0g, grassi 0.7g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Magnesio, Vitamina B12
355) Pagello: kcal 101, proteine 21.0g, grassi 1.9g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Calcio, Potassio
356) Sarago: kcal 103, proteine 20.0g, grassi 2.5g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Iodio, Fosforo
357) Mormora: kcal 97, proteine 20.0g, grassi 1.5g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B6, Niacina
358) Bottarga (muggine): kcal 400, proteine 35.0g, grassi 25.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina A, Omega-3, Sodio
359) BaccalÃ  (ammollato): kcal 95, proteine 21.0g, grassi 1.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Sodio, Iodio
360) Stoccafisso (secco): kcal 350, proteine 80.0g, grassi 3.0g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina B12, Selenio
361) Lumache di terra: kcal 90, proteine 16.0g, grassi 1.4g, carboidrati 2.0g, fibre 0.0g, micronutrienti: Magnesio, Ferro
362) Moscardini: kcal 72, proteine 15.0g, grassi 1.0g, carboidrati 0.7g, fibre 0.0g, micronutrienti: Vitamina B12, Selenio
363) Panocchie (Canocchie): kcal 69, proteine 13.0g, grassi 1.7g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Fosforo, Iodio
365) Crusca di frumento: kcal 216, proteine 15.0g, grassi 4.3g, carboidrati 64.0g, fibre 42.0g, micronutrienti: Magnesio, Manganese
366) Germe di grano: kcal 360, proteine 23.0g, grassi 10.0g, carboidrati 52.0g, fibre 13.0g, micronutrienti: Vitamina E, Zinco, Folati
367) Grano spezzato (Cracked wheat): kcal 340, proteine 12.0g, grassi 2.0g, carboidrati 71.0g, fibre 12.0g, micronutrienti: Selenio, Magnesio
368) Pane di Altamura: kcal 280, proteine 10.0g, grassi 1.5g, carboidrati 57.0g, fibre 3.0g, micronutrienti: Potassio, Fosforo
369) Crackers (integrali): kcal 430, proteine 10.0g, grassi 15.0g, carboidrati 65.0g, fibre 8.0g, micronutrienti: Manganese, Niacina
370) Fette biscottate: kcal 408, proteine 11.0g, grassi 6.0g, carboidrati 75.0g, fibre 4.0g, micronutrienti: Ferro, Tiamina
371) Polenta (farina di mais gialla): kcal 362, proteine 8.0g, grassi 2.8g, carboidrati 77.0g, fibre 7.0g, micronutrienti: Vitamina A, Magnesio
372) Gnocchi di patate: kcal 150, proteine 3.5g, grassi 0.5g, carboidrati 33.0g, fibre 1.0g, micronutrienti: Potassio, Vitamina B6
373) Tortellini (freschi, ripieno carne): kcal 295, proteine 14.0g, grassi 8.0g, carboidrati 41.0g, fibre 1.5g, micronutrienti: Sodio, Selenio
374) Fregola (sarda): kcal 350, proteine 12.0g, grassi 1.5g, carboidrati 72.0g, fibre 3.0g, micronutrienti: Tiamina, Niacina
376) Agretti (Barba di frate): kcal 17, proteine 1.8g, grassi 0.2g, carboidrati 2.2g, fibre 2.1g, micronutrienti: Vitamina A, Calcio
377) Ortica (foglie): kcal 42, proteine 2.7g, grassi 0.1g, carboidrati 7.0g, fibre 6.9g, micronutrienti: Calcio (altissimo), Ferro, Vitamina K
378) Cicoria di campo: kcal 23, proteine 1.7g, grassi 0.3g, carboidrati 4.7g, fibre 4.0g, micronutrienti: Inulina, Vitamina A
379) Tarassaco (foglie): kcal 45, proteine 2.7g, grassi 0.7g, carboidrati 9.0g, fibre 3.5g, micronutrienti: Vitamina A, Vitamina K, Potassio
380) Cime di rapa: kcal 22, proteine 2.9g, grassi 0.3g, carboidrati 2.0g, fibre 2.9g, micronutrienti: Folati, Calcio
381) Verza: kcal 27, proteine 2.0g, grassi 0.1g, carboidrati 6.0g, fibre 2.5g, micronutrienti: Vitamina K, Vitamina C
382) Cavolo nero: kcal 35, proteine 3.3g, grassi 0.7g, carboidrati 6.0g, fibre 2.0g, micronutrienti: Vitamina C, Vitamina K
383) Pak Choi (Bok Choy): kcal 13, proteine 1.5g, grassi 0.2g, carboidrati 2.2g, fibre 1.0g, micronutrienti: Vitamina A, Vitamina C
384) Daikon (ravanello bianco): kcal 18, proteine 0.6g, grassi 0.1g, carboidrati 4.1g, fibre 1.6g, micronutrienti: Vitamina C, Enzimi digestivi
385) Scorzonera (radice): kcal 82, proteine 3.3g, grassi 0.2g, carboidrati 18.0g, fibre 3.3g, micronutrienti: Ferro, Potassio
386) Topinambur: kcal 73, proteine 2.0g, grassi 0.0g, carboidrati 17.0g, fibre 1.6g, micronutrienti: Inulina, Ferro
387) Cardo: kcal 17, proteine 0.7g, grassi 0.1g, carboidrati 4.0g, fibre 1.6g, micronutrienti: Potassio, Magnesio
388) Portulaca: kcal 16, proteine 1.3g, grassi 0.1g, carboidrati 3.4g, fibre 1.0g, micronutrienti: Omega-3, Vitamina C
389) Okra (Gombo): kcal 33, proteine 1.9g, grassi 0.2g, carboidrati 7.0g, fibre 3.2g, micronutrienti: Vitamina K, Manganese
390) Germogli di soia (Mung): kcal 30, proteine 3.0g, grassi 0.2g, carboidrati 6.0g, fibre 1.8g, micronutrienti: Vitamina C, Folati
392) Guava: kcal 68, proteine 2.6g, grassi 1.0g, carboidrati 14.0g, fibre 5.4g, micronutrienti: Vitamina C (altissima), Licopene
393) Litchi: kcal 66, proteine 0.8g, grassi 0.4g, carboidrati 16.5g, fibre 1.3g, micronutrienti: Vitamina C, Potassio
394) Maracuja (Frutto della passione): kcal 97, proteine 2.2g, grassi 0.7g, carboidrati 23.0g, fibre 10.4g, micronutrienti: Vitamina C, Ferro, Vitamina A
395) Dragon Fruit (Pitaya): kcal 50, proteine 1.2g, grassi 0.4g, carboidrati 11.0g, fibre 3.0g, micronutrienti: Magnesio, Vitamina C
396) Carambola: kcal 31, proteine 1.0g, grassi 0.3g, carboidrati 6.7g, fibre 2.8g, micronutrienti: Vitamina C, Potassio
397) Jackfruit (Pane di scimmia): kcal 95, proteine 1.7g, grassi 0.6g, carboidrati 23.2g, fibre 1.5g, micronutrienti: Potassio, Vitamina B6
398) Durian: kcal 147, proteine 1.5g, grassi 5.3g, carboidrati 27.0g, fibre 3.8g, micronutrienti: Vitamina C, Tiamina
399) Rambutan: kcal 82, proteine 0.6g, grassi 0.2g, carboidrati 20.0g, fibre 0.9g, micronutrienti: Manganese, Vitamina C
400) Nespole (del Giappone): kcal 47, proteine 0.4g, grassi 0.2g, carboidrati 12.0g, fibre 1.7g, micronutrienti: Vitamina A, Potassio
401) Ribes rosso: kcal 56, proteine 1.4g, grassi 0.2g, carboidrati 13.8g, fibre 4.3g, micronutrienti: Vitamina C, Manganese
402) Ribes nero: kcal 63, proteine 1.4g, grassi 0.4g, carboidrati 15.4g, fibre 6.8g, micronutrienti: Vitamina C (altissima), Antociani
403) Uva spina: kcal 44, proteine 0.9g, grassi 0.6g, carboidrati 10.0g, fibre 4.3g, micronutrienti: Vitamina C, Manganese
404) Giuggiole (fresche): kcal 79, proteine 1.2g, grassi 0.2g, carboidrati 20.0g, fibre 3.0g, micronutrienti: Vitamina C, Potassio
405) Amarene: kcal 50, proteine 1.0g, grassi 0.3g, carboidrati 12.0g, fibre 1.6g, micronutrienti: Vitamina A, Melatonina naturale
406) Kumquat (Mandarino cinese): kcal 71, proteine 1.9g, grassi 0.9g, carboidrati 16.0g, fibre 6.5g, micronutrienti: Vitamina C, Calcio
408) Olio di cocco: kcal 862, proteine 0.0g, grassi 100g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Acidi grassi a catena media (MCT)
409) Olio di lino: kcal 884, proteine 0.0g, grassi 100g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Omega-3 (ALA), Vitamina E
410) Olio di avocado: kcal 884, proteine 0.0g, grassi 100g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina E, Grassi monoinsaturi
411) Olio di semi di zucca: kcal 884, proteine 0.0g, grassi 100g, carboidrati 0.0g, fibre 0.0g, micronutrienti: Vitamina E, Fitosteroli
412) Aceto di mele: kcal 21, proteine 0.0g, grassi 0.0g, carboidrati 0.9g, fibre 0.0g, micronutrienti: Potassio, Acido acetico
413) Lievito alimentare (in scaglie): kcal 375, proteine 50.0g, grassi 4.0g, carboidrati 35.0g, fibre 25.0g, micronutrienti: Complesso Vitamine B, Zinco
414) Alga Spirulina (essiccata): kcal 290, proteine 57.0g, grassi 7.7g, carboidrati 24.0g, fibre 3.6g, micronutrienti: Ferro, Vitamina B12 (analogo), Ficocianina
415) Alga Nori: kcal 35, proteine 5.8g, grassi 0.3g, carboidrati 5.0g, fibre 0.3g, micronutrienti: Iodio, Vitamina A
416) Alga Wakame: kcal 45, proteine 3.0g, grassi 0.6g, carboidrati 9.0g, fibre 0.5g, micronutrienti: Iodio, Magnesio
417) Miso (pasta di soia): kcal 198, proteine 12.0g, grassi 6.0g, carboidrati 25.0g, fibre 5.0g, micronutrienti: Sodio, Probiotici
418) Abiu: kcal 60, proteine 1.0g, grassi 0.4g, carboidrati 14.5g, fibre 2.0g, micronutrienti: Vitamina C, Niacina
419) Cherimoya (Cirimoia): kcal 75, proteine 1.6g, grassi 0.7g, carboidrati 17.7g, fibre 3.0g, micronutrienti: Vitamina B6, Potassio
420) CupuaÃ§u: kcal 72, proteine 0.8g, grassi 1.2g, carboidrati 14.0g, fibre 2.0g, micronutrienti: Vitamina C, Polifenoli
421) Jujube (Dattero cinese secco): kcal 287, proteine 3.7g, grassi 1.1g, carboidrati 73.0g, fibre 6.0g, micronutrienti: Vitamina C, Potassio
422) Longan (Occhio di drago): kcal 60, proteine 1.3g, grassi 0.1g, carboidrati 15.1g, fibre 1.1g, micronutrienti: Vitamina C, Rame
423) Lucuma (polvere): kcal 329, proteine 4.0g, grassi 1.0g, carboidrati 80.0g, fibre 20.0g, micronutrienti: Zinco, Ferro, Niacina
424) Noni: kcal 15, proteine 0.5g, grassi 0.1g, carboidrati 3.4g, fibre 1.0g, micronutrienti: Vitamina C, Potassio
425) Pepino (Melone-pera): kcal 25, proteine 0.4g, grassi 0.1g, carboidrati 6.0g, fibre 1.5g, micronutrienti: Vitamina C, Vitamina A
426) Pasta di Quinoa e Riso (confezionati): 362 kcal, 2,0 g grassi, 0,4 g grassi saturi, 75,0 g carboidrati, 0,8 g zuccheri, 3,0 g fibre, 9,0 g proteine, 0,01 g sale.
427) Mozzarella di vacca (confezionata): 250 kcal, 18,0 g grassi, 12,5 g grassi saturi, 1,5 g carboidrati, 1,2 g zuccheri, 0 g fibre, 20,0 g proteine, 0,70 g sale.
428) Mozzarella di vacca SL (confezionata): 245 kcal, 18,0 g grassi, 12,5 g grassi saturi, 1,0 g carboidrati, 0,8 g zuccheri, 0 g fibre, 19,5 g proteine, 0,70 g sale.
429) Ricotta vaccina (confezionata): 150 kcal, 11,0 g grassi, 7,5 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 9,0 g proteine, 0,30 g sale.
430) Ricotta vaccina SL (confezionata): 145 kcal, 10,5 g grassi, 7,2 g grassi saturi, 4,0 g carboidrati, 4,0 g zuccheri, 0 g fibre, 8,5 g proteine, 0,35 g sale.
431) Stracchino / Crescenza (confezionata): 285 kcal, 24,0 g grassi, 16,5 g grassi saturi, 2,0 g carboidrati, 2,0 g zuccheri, 0 g fibre, 15,0 g proteine, 0,90 g sale.
432) Stracchino / Crescenza SL (confezionata): 280 kcal, 23,5 g grassi, 16,0 g grassi saturi, 2,5 g carboidrati, 2,5 g zuccheri, 0 g fibre, 14,5 g proteine, 0,95 g sale.
433) Fiocchi di latte (Cottage cheese) (confezionata): 95 kcal, 4,5 g grassi, 3,0 g grassi saturi, 3,0 g carboidrati, 2,5 g zuccheri, 0 g fibre, 11,0 g proteine, 0,75 g sale.
434) Fiocchi di latte SL (confezionata): 92 kcal, 4,3 g grassi, 2,8 g grassi saturi, 3,2 g carboidrati, 3,2 g zuccheri, 0 g fibre, 10,5 g proteine, 0,80 g sale.
435) Formaggio spalmabile classico (tipo Philadelphia) (confezionata): 240 kcal, 22,0 g grassi, 14,5 g grassi saturi, 4,5 g carboidrati, 4,0 g zuccheri, 0 g fibre, 5,5 g proteine, 0,75 g sale.
436) Formaggio spalmabile SL (confezionata): 235 kcal, 21,5 g grassi, 14,0 g grassi saturi, 5,0 g carboidrati, 4,5 g zuccheri, 0 g fibre, 5,2 g proteine, 0,80 g sale.
437) Mascarpone (confezionato): 445 kcal, 47,0 g grassi, 32,0 g grassi saturi, 3,0 g carboidrati, 3,0 g zuccheri, 0 g fibre, 4,5 g proteine, 0,10 g sale.
438) Mascarpone SL (confezionato): 440 kcal, 46,5 g grassi, 31,5 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 4,2 g proteine, 0,11 g sale
439) Parmigiano Reggiano 24 mesi: 402 kcal, 30,0 g grassi, 20,0 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 32,0 g proteine, 1,60 g sale. (Naturalmente SL)
440) Parmigiano Reggiano SL (certificato): 402 kcal, 30,0 g grassi, 20,0 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 32,0 g proteine, 1,60 g sale.
441) Grana Padano: 398 kcal, 29,0 g grassi, 18,5 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 33,0 g proteine, 1,50 g sale. (Naturalmente SL)
442) Pecorino Romano: 390 kcal, 32,0 g grassi, 18,0 g grassi saturi, 0,5 g carboidrati, 0 g zuccheri, 0 g fibre, 25,0 g proteine, 4,50 g sale.
443) Pecorino SL (confezionato): 385 kcal, 31,5 g grassi, 17,5 g grassi saturi, 0,8 g carboidrati, 0,5 g zuccheri, 0 g fibre, 24,5 g proteine, 4,20 g sale.
444) Emmental (confezionato): 370 kcal, 30,0 g grassi, 19,0 g grassi saturi, 0,1 g carboidrati, 0,1 g zuccheri, 0 g fibre, 27,0 g proteine, 0,50 g sale.
445) Emmental SL (confezionato): 368 kcal, 29,5 g grassi, 18,5 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 26,5 g proteine, 0,55 g sale.
446) Edamer (confezionato): 310 kcal, 24,0 g grassi, 15,5 g grassi saturi, 0,1 g carboidrati, 0,1 g zuccheri, 0 g fibre, 24,0 g proteine, 1,80 g sale.
447) Edamer SL (confezionato): 308 kcal, 23,5 g grassi, 15,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 23,5 g proteine, 1,85 g sale.
448) Gorgonzola Dolce: 320 kcal, 27,0 g grassi, 18,5 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 19,0 g proteine, 1,80 g sale. (Naturalmente povero di lattosio)
449) Gorgonzola SL (certificato): 315 kcal, 26,5 g grassi, 18,0 g grassi saturi, 0,8 g carboidrati, 0,8 g zuccheri, 0 g fibre, 18,5 g proteine, 1,85 g sale.
450) Taleggio: 300 kcal, 25,0 g grassi, 17,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 18,5 g proteine, 2,00 g sale.
451) Taleggio SL (confezionato): 295 kcal, 24,5 g grassi, 16,5 g grassi saturi, 0,9 g carboidrati, 0,9 g zuccheri, 0 g fibre, 18,0 g proteine, 2,10 g sale.
452) Asiago pressato: 310 kcal, 24,0 g grassi, 16,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 23,0 g proteine, 1,70 g sale.
453) Asiago SL (confezionato): 305 kcal, 23,5 g grassi, 15,5 g grassi saturi, 1,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 22,5 g proteine, 1,75 g sale.
454) Fontina DOP: 345 kcal, 27,0 g grassi, 18,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 25,0 g proteine, 1,90 g sale.
455) Sottilette / Formaggio a fette fuso (confezionato): 260 kcal, 18,0 g grassi, 11,5 g grassi saturi, 6,0 g carboidrati, 6,0 g zuccheri, 0 g fibre, 18,0 g proteine, 2,80 g sale.
456) Sottilette SL (confezionato): 255 kcal, 17,5 g grassi, 11,0 g grassi saturi, 7,0 g carboidrati, 7,0 g zuccheri, 0 g fibre, 17,5 g proteine, 2,90 g sale.
457) Yogurt bianco intero (confezionato): 63 kcal, 3,5 g grassi, 2,3 g grassi saturi, 4,5 g carboidrati, 4,5 g zuccheri, 0 g fibre, 3,4 g proteine, 0,11 g sale.
458) Yogurt bianco intero SL (confezionato): 63 kcal, 3,5 g grassi, 2,3 g grassi saturi, 5,0 g carboidrati, 5,0 g zuccheri, 0 g fibre, 3,4 g proteine, 0,11 g sale.
459) Yogurt greco 0% grassi (confezionato): 55 kcal, 0 g grassi, 0 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 10,0 g proteine, 0,10 g sale.
460) Yogurt greco 0% SL (confezionato): 57 kcal, 0 g grassi, 0 g grassi saturi, 4,0 g carboidrati, 4,0 g zuccheri, 0 g fibre, 10,0 g proteine, 0,11 g sale
461) Yogurt greco intero (confezionato): 95 kcal, 5,0 g grassi, 3,5 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 9,0 g proteine, 0,10 g sale.
462) Kefir (confezionato): 50 kcal, 2,0 g grassi, 1,3 g grassi saturi, 4,0 g carboidrati, 4,0 g zuccheri, 0 g fibre, 3,5 g proteine, 0,10 g sale.
463) Kefir SL (confezionato): 50 kcal, 2,0 g grassi, 1,3 g grassi saturi, 4,5 g carboidrati, 4,5 g zuccheri, 0 g fibre, 3,5 g proteine, 0,11 g sale.
465) Mozzarella di Bufala Campana DOP (confezionata): 288 kcal, 24,5 g grassi, 17,0 g grassi saturi, 0,7 g carboidrati, 0,7 g zuccheri, 0 g fibre, 16,5 g proteine, 0,60 g sale.
466) Mozzarella di Bufala SL (confezionata): 285 kcal, 24,0 g grassi, 16,8 g grassi saturi, 1,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 16,2 g proteine, 0,65 g sale.
467) Ricotta di Bufala (confezionata): 210 kcal, 17,5 g grassi, 12,0 g grassi saturi, 4,5 g carboidrati, 4,5 g zuccheri, 0 g fibre, 8,5 g proteine, 0,40 g sale.
468) Feta Greca (confezionata): 275 kcal, 23,0 g grassi, 16,0 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 16,5 g proteine, 2,50 g sale.
469) Feta Greca SL (confezionata): 270 kcal, 22,5 g grassi, 15,5 g grassi saturi, 1,5 g carboidrati, 1,0 g zuccheri, 0 g fibre, 16,0 g proteine, 2,60 g sale.
470) Caprino fresco (vaccino/caprino) (confezionato): 240 kcal, 20,0 g grassi, 14,0 g grassi saturi, 2,5 g carboidrati, 2,5 g zuccheri, 0 g fibre, 12,5 g proteine, 0,80 g sale.
471) Caprino fresco SL (confezionato): 235 kcal, 19,5 g grassi, 13,5 g grassi saturi, 3,0 g carboidrati, 3,0 g zuccheri, 0 g fibre, 12,0 g proteine, 0,85 g sale.
472) Tronchetto di Capra stagionato (confezionato): 295 kcal, 24,0 g grassi, 17,0 g grassi saturi, 1,5 g carboidrati, 1,0 g zuccheri, 0 g fibre, 18,5 g proteine, 1,50 g sale.
473) Ricotta di pecora (confezionata): 165 kcal, 13,0 g grassi, 9,0 g grassi saturi, 3,8 g carboidrati, 3,8 g zuccheri, 0 g fibre, 9,5 g proteine, 0,45 g sale.
474) Burrata (confezionata): 260 kcal, 23,0 g grassi, 15,5 g grassi saturi, 2,0 g carboidrati, 1,8 g zuccheri, 0 g fibre, 11,5 g proteine, 0,60 g sale.
475) Burrata SL (confezionata): 255 kcal, 22,5 g grassi, 15,0 g grassi saturi, 2,5 g carboidrati, 2,2 g zuccheri, 0 g fibre, 11,0 g proteine, 0,65 g sale.
476) Scamorza bianca (confezionata): 210 kcal, 14,0 g grassi, 9,5 g grassi saturi, 1,5 g carboidrati, 1,5 g zuccheri, 0 g fibre, 19,0 g proteine, 1,20 g sale.
477) Scamorza bianca SL (confezionata): 208 kcal, 13,8 g grassi, 9,2 g grassi saturi, 2,0 g carboidrati, 1,8 g zuccheri, 0 g fibre, 18,5 g proteine, 1,25 g sale.
478) Scamorza affumicata (confezionata): 212 kcal, 14,5 g grassi, 9,8 g grassi saturi, 1,5 g carboidrati, 1,5 g zuccheri, 0 g fibre, 19,5 g proteine, 1,30 g sale.
479) Caciotta vaccina (confezionata): 265 kcal, 21,0 g grassi, 14,5 g grassi saturi, 1,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 18,0 g proteine, 1,10 g sale.
480) Caciotta SL (confezionata): 260 kcal, 20,5 g grassi, 14,0 g grassi saturi, 1,5 g carboidrati, 1,5 g zuccheri, 0 g fibre, 17,5 g proteine, 1,15 g sale.
481) Squacquerone (confezionato): 245 kcal, 21,5 g grassi, 15,0 g grassi saturi, 2,5 g carboidrati, 2,5 g zuccheri, 0 g fibre, 10,5 g proteine, 0,80 g sale.
482) Quark (confezionato): 70 kcal, 0,3 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 4,0 g zuccheri, 0 g fibre, 12,0 g proteine, 0,10 g sale.
483) Quark SL (confezionato): 70 kcal, 0,3 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 4,5 g zuccheri, 0 g fibre, 11,5 g proteine, 0,11 g sale.
484) Camembert / Brie (confezionato): 290 kcal, 24,0 g grassi, 16,5 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 18,0 g proteine, 1,60 g sale.
485) Brie SL (confezionato): 285 kcal, 23,5 g grassi, 16,0 g grassi saturi, 1,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 17,5 g proteine, 1,65 g sale.
487) Mozzarella Light (confezionata): 165 kcal, 9,0 g grassi, 6,0 g grassi saturi, 1,5 g carboidrati, 1,0 g zuccheri, 0 g fibre, 19,5 g proteine, 0,80 g sale.
488) Mozzarella Light SL (confezionata): 162 kcal, 8,8 g grassi, 5,8 g grassi saturi, 1,8 g carboidrati, 1,2 g zuccheri, 0 g fibre, 19,0 g proteine, 0,85 g sale.
489) Formaggio spalmabile Light (confezionato): 155 kcal, 11,0 g grassi, 7,5 g grassi saturi, 6,0 g carboidrati, 5,5 g zuccheri, 0 g fibre, 8,0 g proteine, 0,85 g sale.
490) Formaggio spalmabile Light SL (confezionato): 150 kcal, 10,5 g grassi, 7,0 g grassi saturi, 6,5 g carboidrati, 6,0 g zuccheri, 0 g fibre, 7,5 g proteine, 0,90 g sale.
491) Ricotta Light (confezionata): 120 kcal, 8,0 g grassi, 5,5 g grassi saturi, 4,0 g carboidrati, 4,0 g zuccheri, 0 g fibre, 8,0 g proteine, 0,40 g sale.
492) Ricotta Light SL (confezionata): 115 kcal, 7,5 g grassi, 5,0 g grassi saturi, 4,5 g carboidrati, 4,5 g zuccheri, 0 g fibre, 7,5 g proteine, 0,45 g sale.
493) Leerdammer / Formaggio a fette Light (confezionato): 270 kcal, 17,0 g grassi, 11,5 g grassi saturi, 0,1 g carboidrati, 0,1 g zuccheri, 0 g fibre, 29,0 g proteine, 1,50 g sale.
494) Skyr bianco naturale (confezionato): 65 kcal, 0,2 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 4,0 g zuccheri, 0 g fibre, 11,5 g proteine, 0,10 g sale. (Simile allo yogurt ma tecnicamente un formaggio fresco).
495) Pasta di Grano Saraceno (confezionati): 345 kcal, 2,5 g grassi, 0,5 g grassi saturi, 67,0 g carboidrati, 1,0 g zuccheri, 4,5 g fibre, 11,0 g proteine, 0,01 g sale.
496) Noodles di frumento (confezionati/secchi): 360 kcal, 1,5 g grassi, 0,3 g grassi saturi, 73,0 g carboidrati, 2,0 g zuccheri, 2,5 g fibre, 12,0 g proteine, 0,50 g sale.
497) Noodles di riso (confezionati/secchi): 350 kcal, 0,5 g grassi, 0,1 g grassi saturi, 80,0 g carboidrati, 0,1 g zuccheri, 1,0 g fibre, 6,0 g proteine, 0,10 g sale.
498) Ramen precotti in tazza (confezionati - solo pasta): 440 kcal, 18,0 g grassi, 8,5 g grassi saturi, 58,0 g carboidrati, 2,5 g zuccheri, 2,5 g fibre, 9,5 g proteine, 3,50 g sale (alto perchÃ© spesso pre-fritti).
499) Soba (Grano saraceno e frumento): 350 kcal, 2,0 g grassi, 0,4 g grassi saturi, 68,0 g carboidrati, 1,5 g zuccheri, 3,5 g fibre, 14,0 g proteine, 0,60 g sale.
500) Udon freschi (confezionati): 130 kcal, 0,5 g grassi, 0,1 g grassi saturi, 27,0 g carboidrati, 0,5 g zuccheri, 1,0 g fibre, 4,0 g proteine, 0,40 g sale.
501) Shirataki di Konjac (confezionati/in acqua): 10 kcal, 0,0 g grassi, 0,0 g grassi saturi, 0,5 g carboidrati, 0,0 g zuccheri, 3,5 g fibre, 0,1 g proteine, 0,01 g sale.
502) Pasta proteica a base di soia (confezionata): 330 kcal, 6,0 g grassi, 1,0 g grassi saturi, 15,0 g carboidrati, 4,0 g zuccheri, 20,0 g fibre, 45,0 g proteine, 0,02 g sale.
503) Pasta proteica con albume d'uovo (confezionata): 350 kcal, 2,5 g grassi, 0,8 g grassi saturi, 50,0 g carboidrati, 2,0 g zuccheri, 6,0 g fibre, 30,0 g proteine, 0,15 g sale.
504) Pasta di farina di lupini (confezionata): 325 kcal, 7,0 g grassi, 1,0 g grassi saturi, 12,0 g carboidrati, 3,0 g zuccheri, 30,0 g fibre, 38,0 g proteine, 0,05 g sale.
505) Fusilli proteici ai piselli e proteine del grano (confezionata): 345 kcal, 3,0 g grassi, 0,5 g grassi saturi, 45,0 g carboidrati, 2,5 g zuccheri, 8,0 g fibre, 32,0 g proteine, 0,10 g sale.
506) Pasta al peperoncino (confezionata): 355 kcal, 1,6 g grassi, 0,3 g grassi saturi, 70,0 g carboidrati, 3,5 g zuccheri, 3,5 g fibre, 13,0 g proteine, 0,02 g sale.
507) Pasta agli spinaci (confezionata): 350 kcal, 1,5 g grassi, 0,3 g grassi saturi, 70,0 g carboidrati, 3,2 g zuccheri, 4,0 g fibre, 12,5 g proteine, 0,05 g sale.
508) Pasta al nero di seppia (confezionata): 358 kcal, 1,8 g grassi, 0,4 g grassi saturi, 69,0 g carboidrati, 3,0 g zuccheri, 3,0 g fibre, 14,0 g proteine, 0,50 g sale.
509) Pasta al limone e pepe (confezionata): 352 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 12,5 g proteine, 0,02 g sale.
510) Pasta al tartufo (confezionata): 360 kcal, 2,0 g grassi, 0,5 g grassi saturi, 70,0 g carboidrati, 3,0 g zuccheri, 3,0 g fibre, 13,5 g proteine, 0,10 g sale.
511) Pasta alla barbabietola (confezionata): 350 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 4,0 g zuccheri, 4,0 g fibre, 12,0 g proteine, 0,05 g sale.
512) Pasta alla curcuma e zenzero (confezionata): 355 kcal, 1,7 g grassi, 0,4 g grassi saturi, 70,0 g carboidrati, 3,0 g zuccheri, 3,5 g fibre, 12,8 g proteine, 0,02 g sale.
513) Pasta tricolore (pomodoro/spinaci/semola) (confezionata): 353 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,2 g fibre, 12,5 g proteine, 0,03 g sale.
514) Gnocchi di patate surgelati (confezionati): 155 kcal, 0,4 g grassi, 0,1 g grassi saturi, 33,0 g carboidrati, 1,0 g zuccheri, 1,8 g fibre, 3,5 g proteine, 1,00 g sale.
515) Ravioli surgelati ai quattro formaggi (confezionati): 270 kcal, 11,0 g grassi, 6,0 g grassi saturi, 32,0 g carboidrati, 2,0 g zuccheri, 2,0 g fibre, 10,0 g proteine, 1,10 g sale.
516) Tortellini alla carne surgelati (confezionati): 285 kcal, 8,0 g grassi, 3,0 g grassi saturi, 39,0 g carboidrati, 1,8 g zuccheri, 2,5 g fibre, 13,0 g proteine, 1,20 g sale.
517) Penne all'arrabbiata surgelate (piatto pronto) (confezionati): 140 kcal, 4,5 g grassi, 0,7 g grassi saturi, 19,0 g carboidrati, 2,5 g zuccheri, 2,0 g fibre, 4,5 g proteine, 0,90 g sale.
518) Tagliatelle ai funghi surgelate (piatto pronto) (confezionati): 155 kcal, 7,0 g grassi, 3,5 g grassi saturi, 17,0 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 5,0 g proteine, 1,00 g sale.
519) Lasagne alla bolognese surgelate (confezionati): 165 kcal, 8,5 g grassi, 4,2 g grassi saturi, 14,0 g carboidrati, 2,8 g zuccheri, 1,5 g fibre, 7,5 g proteine, 0,95 g sale.
520) Cannelloni ricotta e spinaci surgelati (confezionati): 150 kcal, 7,5 g grassi, 4,0 g grassi saturi, 13,0 g carboidrati, 2,5 g zuccheri, 1,8 g fibre, 6,8 g proteine, 0,85 g sale.
521) Pasta di mais viola (confezionata): 355 kcal, 1,8 g grassi, 0,4 g grassi saturi, 76,0 g carboidrati, 0,8 g zuccheri, 3,5 g fibre, 7,5 g proteine, 0,01 g sale.
522) Pasta di canapa (confezionata): 345 kcal, 4,0 g grassi, 0,6 g grassi saturi, 60,0 g carboidrati, 2,0 g zuccheri, 9,0 g fibre, 16,0 g proteine, 0,02 g sale.
523) Pasta di teff (confezionata): 340 kcal, 2,2 g grassi, 0,5 g grassi saturi, 68,0 g carboidrati, 1,5 g zuccheri, 7,5 g fibre, 11,0 g proteine, 0,02 g sale.
524) Anelletti siciliani (secca) (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 13,0 g proteine, 0,01 g sale.
525) Fregola sarda tostata (secca) (confezionata): 358 kcal, 1,6 g grassi, 0,3 g grassi saturi, 72,0 g carboidrati, 3,2 g zuccheri, 3,5 g fibre, 12,5 g proteine, 0,02 g sale.
526) SpÃ¤tzle tirolesi agli spinaci (freschi) (confezionati): 180 kcal, 3,5 g grassi, 1,0 g grassi saturi, 30,0 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 6,0 g proteine, 1,20 g sale.
527) Pane comune (tipo 0): 265 kcal, 1,3 g grassi, 0,3 g grassi saturi, 54,0 g carboidrati, 2,5 g zuccheri, 2,7 g fibre, 8,5 g proteine, 1,50 g sale.
528) Pane di grano duro (tipo Altamura): 275 kcal, 1,5 g grassi, 0,3 g grassi saturi, 56,0 g carboidrati, 2,0 g zuccheri, 3,2 g fibre, 9,5 g proteine, 1,40 g sale.
529) Pane integrale fresco: 245 kcal, 2,0 g grassi, 0,4 g grassi saturi, 46,0 g carboidrati, 2,2 g zuccheri, 6,5 g fibre, 9,0 g proteine, 1,30 g sale.
530) Pane di segale (Nero): 230 kcal, 1,5 g grassi, 0,2 g grassi saturi, 45,0 g carboidrati, 2,0 g zuccheri, 8,0 g fibre, 7,5 g proteine, 1,40 g sale.
531) Pane ai cereali: 270 kcal, 4,5 g grassi, 0,8 g grassi saturi, 48,0 g carboidrati, 2,5 g zuccheri, 5,5 g fibre, 10,0 g proteine, 1,40 g sale.
532) Pane all'olio: 305 kcal, 6,5 g grassi, 1,2 g grassi saturi, 53,0 g carboidrati, 3,0 g zuccheri, 2,5 g fibre, 8,0 g proteine, 1,60 g sale.
533) Pane al latte: 315 kcal, 7,5 g grassi, 4,5 g grassi saturi, 52,0 g carboidrati, 5,5 g zuccheri, 2,2 g fibre, 9,0 g proteine, 1,50 g sale.
534) Pane di mais: 280 kcal, 3,0 g grassi, 0,5 g grassi saturi, 55,0 g carboidrati, 2,5 g zuccheri, 3,0 g fibre, 7,5 g proteine, 1,40 g sale.
535) Pane di farro: 260 kcal, 2,2 g grassi, 0,4 g grassi saturi, 50,0 g carboidrati, 2,0 g zuccheri, 5,0 g fibre, 10,5 g proteine, 1,35 g sale.
536) Pane azzimo (senza lievito): 365 kcal, 1,2 g grassi, 0,2 g grassi saturi, 77,0 g carboidrati, 1,5 g zuccheri, 3,0 g fibre, 11,0 g proteine, 0,05 g sale.
537) Pane di zucca: 260 kcal, 3,5 g grassi, 0,6 g grassi saturi, 48,0 g carboidrati, 4,5 g zuccheri, 3,5 g fibre, 8,0 g proteine, 1,30 g sale.
538) Michetta / Rosetta: 275 kcal, 1,0 g grassi, 0,2 g grassi saturi, 58,0 g carboidrati, 2,5 g zuccheri, 2,5 g fibre, 9,0 g proteine, 1,55 g sale.
539) Baguette: 285 kcal, 1,2 g grassi, 0,3 g grassi saturi, 59,0 g carboidrati, 3,0 g zuccheri, 2,8 g fibre, 8,5 g proteine, 1,60 g sale.
540) Focaccia liscia (fresca): 310 kcal, 10,0 g grassi, 1,5 g grassi saturi, 48,0 g carboidrati, 2,0 g zuccheri, 2,0 g fibre, 7,5 g proteine, 2,20 g sale.
541) Pan Bauletto Bianco (confezionato): 265 kcal, 3,5 g grassi, 0,8 g grassi saturi, 49,0 g carboidrati, 5,5 g zuccheri, 2,5 g fibre, 8,0 g proteine, 1,30 g sale.
542) Pan Bauletto Integrale (confezionato): 255 kcal, 4,0 g grassi, 0,6 g grassi saturi, 42,0 g carboidrati, 5,0 g zuccheri, 7,5 g fibre, 9,5 g proteine, 1,20 g sale.
543) Pan Bauletto ai Cereali e Semi (confezionato): 285 kcal, 7,5 g grassi, 1,0 g grassi saturi, 41,0 g carboidrati, 4,5 g zuccheri, 6,5 g fibre, 10,5 g proteine, 1,25 g sale.
544) Pane per Tramezzini (senza crosta) (confezionato): 275 kcal, 5,0 g grassi, 1,5 g grassi saturi, 48,0 g carboidrati, 6,0 g zuccheri, 2,2 g fibre, 8,5 g proteine, 1,40 g sale.
545) Pane Americano (Sandwich) (confezionato): 280 kcal, 5,5 g grassi, 2,0 g grassi saturi, 47,0 g carboidrati, 7,0 g zuccheri, 2,5 g fibre, 9,0 g proteine, 1,50 g sale.
546) Pane di Segale confezionato (tipo Pumpernickel): 210 kcal, 1,2 g grassi, 0,2 g grassi saturi, 38,0 g carboidrati, 3,5 g zuccheri, 9,5 g fibre, 6,0 g proteine, 1,20 g sale.
547) PancarrÃ© classico (confezionato): 285 kcal, 4,5 g grassi, 1,2 g grassi saturi, 52,0 g carboidrati, 5,0 g zuccheri, 3,0 g fibre, 8,5 g proteine, 1,50 g sale.
548) Burger Buns (Pane per Hamburger) (confezionato): 295 kcal, 6,5 g grassi, 2,5 g grassi saturi, 50,0 g carboidrati, 8,5 g zuccheri, 2,5 g fibre, 9,5 g proteine, 1,35 g sale.
549) Hot Dog Rolls (confezionato): 300 kcal, 7,0 g grassi, 2,8 g grassi saturi, 51,0 g carboidrati, 9,0 g zuccheri, 2,3 g fibre, 9,0 g proteine, 1,40 g sale.
550) Piadina Romagnola all'olio (confezionata): 310 kcal, 9,0 g grassi, 1,2 g grassi saturi, 50,0 g carboidrati, 2,0 g zuccheri, 2,5 g fibre, 7,5 g proteine, 1,80 g sale.
551) Piadina Romagnola allo strutto (confezionata): 340 kcal, 14,0 g grassi, 5,5 g grassi saturi, 46,0 g carboidrati, 1,5 g zuccheri, 2,2 g fibre, 7,0 g proteine, 1,90 g sale.
552) Piadina integrale (confezionata): 290 kcal, 8,5 g grassi, 1,0 g grassi saturi, 44,0 g carboidrati, 2,2 g zuccheri, 6,5 g fibre, 8,5 g proteine, 1,70 g sale.
553) Piadina al farro (confezionata): 300 kcal, 9,5 g grassi, 1,2 g grassi saturi, 46,0 g carboidrati, 1,8 g zuccheri, 5,0 g fibre, 9,0 g proteine, 1,80 g sale.
554) Tortilla di frumento (confezionata): 315 kcal, 8,5 g grassi, 3,5 g grassi saturi, 51,0 g carboidrati, 3,0 g zuccheri, 2,8 g fibre, 8,0 g proteine, 1,90 g sale.
555) Tortilla di mais (messicana): 220 kcal, 3,0 g grassi, 0,5 g grassi saturi, 44,0 g carboidrati, 1,5 g zuccheri, 5,5 g fibre, 5,5 g proteine, 0,20 g sale.
556) Pane Arabo / Pita: 275 kcal, 1,2 g grassi, 0,2 g grassi saturi, 56,0 g carboidrati, 2,5 g zuccheri, 2,5 g fibre, 9,0 g proteine, 1,30 g sale.
557) Pane Naan (confezionato): 310 kcal, 8,5 g grassi, 3,5 g grassi saturi, 50,0 g carboidrati, 4,0 g zuccheri, 2,2 g fibre, 9,0 g proteine, 1,40 g sale.
558) Grissini torinesi (confezionati): 420 kcal, 9,5 g grassi, 1,5 g grassi saturi, 72,0 g carboidrati, 3,5 g zuccheri, 3,5 g fibre, 11,0 g proteine, 2,20 g sale.
559) Grissini integrali (confezionati): 395 kcal, 8,0 g grassi, 1,2 g grassi saturi, 65,0 g carboidrati, 3,0 g zuccheri, 9,0 g fibre, 12,0 g proteine, 2,10 g sale.
560) Cracker salati (confezionati): 440 kcal, 14,0 g grassi, 3,5 g grassi saturi, 68,0 g carboidrati, 2,5 g zuccheri, 3,0 g fibre, 10,0 g proteine, 2,80 g sale.
561) Cracker integrali (confezionati): 420 kcal, 12,5 g grassi, 2,0 g grassi saturi, 62,0 g carboidrati, 2,8 g zuccheri, 9,5 g fibre, 11,5 g proteine, 2,30 g sale.
562) Gallette di riso: 385 kcal, 2,8 g grassi, 0,6 g grassi saturi, 81,0 g carboidrati, 0,5 g zuccheri, 3,0 g fibre, 8,0 g proteine, 0,10 g sale.
563) Gallette di mais: 375 kcal, 1,5 g grassi, 0,3 g grassi saturi, 82,0 g carboidrati, 0,8 g zuccheri, 4,0 g fibre, 7,0 g proteine, 0,40 g sale.
564) Fette biscottate classiche: 390 kcal, 5,5 g grassi, 2,5 g grassi saturi, 72,0 g carboidrati, 7,0 g zuccheri, 4,5 g fibre, 11,5 g proteine, 1,40 g sale.
565) Taralli pugliesi all'olio (confezionati): 460 kcal, 19,0 g grassi, 2,8 g grassi saturi, 62,0 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 9,5 g proteine, 2,50 g sale.
566) Pane croccante (tipo Wasa): 335 kcal, 1,5 g grassi, 0,3 g grassi saturi, 62,0 g carboidrati, 1,5 g zuccheri, 19,0 g fibre, 10,0 g proteine, 1,20 g sale.
567) Cracker non salati in superficie: 435 kcal, 13,0 g grassi, 1,8 g grassi saturi, 69,0 g carboidrati, 2,2 g zuccheri, 3,2 g fibre, 10,0 g proteine, 1,40 g sale.
568) Cracker al riso suffiato: 410 kcal, 8,5 g grassi, 1,2 g grassi saturi, 74,0 g carboidrati, 2,0 g zuccheri, 2,5 g fibre, 8,5 g proteine, 1,80 g sale.
569) Cracker alla soia: 425 kcal, 14,5 g grassi, 2,1 g grassi saturi, 58,0 g carboidrati, 2,5 g zuccheri, 5,5 g fibre, 14,0 g proteine, 2,10 g sale.
570) Cracker senza glutine (riso/mais): 450 kcal, 15,0 g grassi, 1,8 g grassi saturi, 75,0 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 4,0 g proteine, 2,50 g sale.
571) Cracker ai cereali antichi (quinoa/semi di chia): 438 kcal, 16,0 g grassi, 2,0 g grassi saturi, 59,0 g carboidrati, 3,0 g zuccheri, 7,0 g fibre, 11,5 g proteine, 2,00 g sale.
572) Sfogliatine croccanti al rosmarino: 460 kcal, 18,0 g grassi, 2,5 g grassi saturi, 65,0 g carboidrati, 2,0 g zuccheri, 3,0 g fibre, 9,0 g proteine, 2,40 g sale.
573) Cracker con farina di ceci: 415 kcal, 12,0 g grassi, 1,5 g grassi saturi, 54,0 g carboidrati, 2,2 g zuccheri, 9,0 g fibre, 18,0 g proteine, 1,90 g sale.
574) Gallette di farro: 370 kcal, 2,5 g grassi, 0,4 g grassi saturi, 72,0 g carboidrati, 1,0 g zuccheri, 7,0 g fibre, 12,0 g proteine, 0,05 g sale.
575) Gallette di grano saraceno: 380 kcal, 3,0 g grassi, 0,6 g grassi saturi, 75,0 g carboidrati, 0,8 g zuccheri, 4,5 g fibre, 11,5 g proteine, 0,02 g sale.
576) Gallette di quinoa: 390 kcal, 5,5 g grassi, 0,7 g grassi saturi, 70,0 g carboidrati, 1,2 g zuccheri, 6,0 g fibre, 13,0 g proteine, 0,10 g sale.
577) Gallette di legumi (lenticchie/piselli): 345 kcal, 2,0 g grassi, 0,3 g grassi saturi, 55,0 g carboidrati, 2,0 g zuccheri, 10,0 g fibre, 22,0 g proteine, 0,80 g sale.
578) Pani di segale croccanti (tipo Svedese sottile): 340 kcal, 1,5 g grassi, 0,3 g grassi saturi, 64,0 g carboidrati, 1,5 g zuccheri, 20,0 g fibre, 9,5 g proteine, 1,25 g sale.
579) Mini gallette di mais al formaggio (snack): 465 kcal, 18,0 g grassi, 2,5 g grassi saturi, 68,0 g carboidrati, 3,0 g zuccheri, 3,5 g fibre, 7,0 g proteine, 2,20 g sale.
580) Schiacciatine mantovane (secche): 455 kcal, 16,0 g grassi, 2,3 g grassi saturi, 66,0 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 10,0 g proteine, 2,60 g sale.
581) Bruschette chips (aglio e olio): 480 kcal, 21,0 g grassi, 3,0 g grassi saturi, 62,0 g carboidrati, 3,5 g zuccheri, 4,0 g fibre, 8,5 g proteine, 2,10 g sale.
582) Tarallini al peperoncino: 465 kcal, 20,0 g grassi, 2,9 g grassi saturi, 60,0 g carboidrati, 1,5 g zuccheri, 3,0 g fibre, 9,0 g proteine, 2,40 g sale.
583) Tarallini ai semi di finocchio: 462 kcal, 19,5 g grassi, 2,8 g grassi saturi, 61,0 g carboidrati, 1,2 g zuccheri, 3,2 g fibre, 9,2 g proteine, 2,30 g sale.
584) Tarallini integrali: 445 kcal, 18,0 g grassi, 2,5 g grassi saturi, 56,0 g carboidrati, 2,0 g zuccheri, 8,0 g fibre, 11,0 g proteine, 2,10 g sale.
585) Pretzel / Brezel secchi: 380 kcal, 3,5 g grassi, 1,5 g grassi saturi, 75,0 g carboidrati, 2,5 g zuccheri, 3,0 g fibre, 10,0 g proteine, 3,50 g sale.
586) Crostoni di pane per zuppa (fritti): 520 kcal, 28,0 g grassi, 4,5 g grassi saturi, 58,0 g carboidrati, 2,5 g zuccheri, 3,5 g fibre, 7,5 g proteine, 2,00 g sale.
587) Fette biscottate integrali: 375 kcal, 5,0 g grassi, 1,2 g grassi saturi, 65,0 g carboidrati, 6,5 g zuccheri, 11,0 g fibre, 12,5 g proteine, 1,20 g sale.
588) Fette biscottate ai cereali: 395 kcal, 7,0 g grassi, 1,5 g grassi saturi, 67,0 g carboidrati, 7,5 g zuccheri, 6,5 g fibre, 12,0 g proteine, 1,30 g sale.
589) Fette biscottate malto d'orzo: 405 kcal, 6,5 g grassi, 2,8 g grassi saturi, 73,0 g carboidrati, 9,0 g zuccheri, 4,0 g fibre, 11,0 g proteine, 1,15 g sale.
590) Crostini dorati (confezionati): 430 kcal, 12,0 g grassi, 1,8 g grassi saturi, 68,0 g carboidrati, 4,5 g zuccheri, 4,0 g fibre, 11,5 g proteine, 2,00 g sale.
591) Pan fette senza glutine (tostato): 390 kcal, 8,0 g grassi, 1,2 g grassi saturi, 74,0 g carboidrati, 5,0 g zuccheri, 5,0 g fibre, 3,5 g proteine, 1,60 g sale.
592) Grissini al sesamo: 435 kcal, 13,0 g grassi, 2,0 g grassi saturi, 64,0 g carboidrati, 3,0 g zuccheri, 4,5 g fibre, 12,5 g proteine, 2,20 g sale.
593) Grissini con farina di mais: 415 kcal, 9,0 g grassi, 1,3 g grassi saturi, 72,0 g carboidrati, 3,5 g zuccheri, 3,5 g fibre, 10,0 g proteine, 2,10 g sale.
594) Grissini ricoperti di cioccolato (snack): 510 kcal, 25,0 g grassi, 14,0 g grassi saturi, 62,0 g carboidrati, 35,0 g zuccheri, 3,0 g fibre, 7,5 g proteine, 0,60 g sale.
595) Grissini al formaggio: 450 kcal, 16,0 g grassi, 6,0 g grassi saturi, 61,0 g carboidrati, 2,5 g zuccheri, 2,5 g fibre, 13,0 g proteine, 2,50 g sale.
596) Cornflakes classici (confezionati): 380 kcal, 0,9 g grassi, 0,2 g grassi saturi, 84,0 g carboidrati, 8,0 g zuccheri, 3,0 g fibre, 7,0 g proteine, 1,80 g sale.
597) Cornflakes integrali (confezionati): 365 kcal, 2,0 g grassi, 0,4 g grassi saturi, 75,0 g carboidrati, 6,0 g zuccheri, 9,0 g fibre, 8,5 g proteine, 1,20 g sale.
598) Bastoncini di crusca di frumento (confezionati): 335 kcal, 3,5 g grassi, 0,6 g grassi saturi, 48,0 g carboidrati, 14,0 g zuccheri, 27,0 g fibre, 14,0 g proteine, 0,90 g sale.
599) Riso soffiato semplice (confezionati): 385 kcal, 1,0 g grassi, 0,2 g grassi saturi, 86,0 g carboidrati, 0,5 g zuccheri, 1,5 g fibre, 7,5 g proteine, 0,02 g sale.
600) Anellini di avena al miele (confezionati): 395 kcal, 5,0 g grassi, 1,0 g grassi saturi, 75,0 g carboidrati, 25,0 g zuccheri, 6,0 g fibre, 9,0 g proteine, 1,00 g sale.
601) Palline di riso e mais al cioccolato (confezionati): 390 kcal, 4,0 g grassi, 2,0 g grassi saturi, 78,0 g carboidrati, 28,0 g zuccheri, 4,5 g fibre, 7,5 g proteine, 0,80 g sale.
602) Muesli croccante (Granola) classico (confezionati): 450 kcal, 16,0 g grassi, 7,0 g grassi saturi, 63,0 g carboidrati, 22,0 g zuccheri, 7,0 g fibre, 8,5 g proteine, 0,10 g sale.
603) Muesli croccante al cioccolato (confezionati): 470 kcal, 19,0 g grassi, 9,0 g grassi saturi, 61,0 g carboidrati, 25,0 g zuccheri, 7,5 g fibre, 9,0 g proteine, 0,15 g sale.
604) Muesli classico (non croccante) con frutta secca (confezionati): 370 kcal, 8,0 g grassi, 1,5 g grassi saturi, 60,0 g carboidrati, 18,0 g zuccheri, 9,5 g fibre, 10,0 g proteine, 0,05 g sale.
605) Fiocchi d'avena integrali (confezionati): 375 kcal, 7,0 g grassi, 1,3 g grassi saturi, 59,0 g carboidrati, 1,0 g zuccheri, 10,0 g fibre, 13,5 g proteine, 0,01 g sale.
606) Fiocchi di farro (confezionati): 345 kcal, 2,5 g grassi, 0,4 g grassi saturi, 65,0 g carboidrati, 1,5 g zuccheri, 8,0 g fibre, 12,0 g proteine, 0,01 g sale.
607) Riso Arborio/Carnaroli (confezionati): 345 kcal, 0,6 g grassi, 0,1 g grassi saturi, 78,0 g carboidrati, 0,3 g zuccheri, 1,0 g fibre, 7,0 g proteine, 0,01 g sale.
608) Riso Basmati (confezionati): 350 kcal, 0,5 g grassi, 0,1 g grassi saturi, 78,0 g carboidrati, 0,2 g zuccheri, 1,2 g fibre, 8,5 g proteine, 0,01 g sale.
609) Riso Integrale (confezionati): 340 kcal, 2,5 g grassi, 0,5 g grassi saturi, 70,0 g carboidrati, 0,5 g zuccheri, 4,5 g fibre, 7,5 g proteine, 0,01 g sale.
610) Riso Rosso (confezionati): 355 kcal, 2,5 g grassi, 0,5 g grassi saturi, 72,0 g carboidrati, 0,8 g zuccheri, 3,5 g fibre, 8,0 g proteine, 0,01 g sale.
611) Riso Venere (Nero) (confezionati): 350 kcal, 2,2 g grassi, 0,5 g grassi saturi, 70,0 g carboidrati, 0,7 g zuccheri, 4,0 g fibre, 9,0 g proteine, 0,01 g sale.
612) Riso Parboiled (confezionati): 352 kcal, 0,8 g grassi, 0,2 g grassi saturi, 79,0 g carboidrati, 0,3 g zuccheri, 1,5 g fibre, 7,5 g proteine, 0,01 g sale.
613) Quinoa (a crudo) (confezionati): 368 kcal, 6,0 g grassi, 0,7 g grassi saturi, 64,0 g carboidrati, 1,5 g zuccheri, 7,0 g fibre, 14,0 g proteine, 0,01 g sale.
614) Bulgur (Grano spezzato) (confezionati): 342 kcal, 1,3 g grassi, 0,2 g grassi saturi, 63,0 g carboidrati, 0,4 g zuccheri, 12,5 g fibre, 12,0 g proteine, 0,01 g sale.
615) Cous cous di semola (a crudo) (confezionati): 355 kcal, 1,5 g grassi, 0,3 g grassi saturi, 71,0 g carboidrati, 2,0 g zuccheri, 3,5 g fibre, 12,5 g proteine, 0,01 g sale.
616) Cous cous integrale (a crudo) (confezionati): 348 kcal, 2,2 g grassi, 0,5 g grassi saturi, 64,0 g carboidrati, 1,8 g zuccheri, 8,5 g fibre, 13,0 g proteine, 0,01 g sale.
617) Miglio (a crudo) (confezionati): 360 kcal, 3,9 g grassi, 0,6 g grassi saturi, 69,0 g carboidrati, 1,5 g zuccheri, 3,5 g fibre, 11,0 g proteine, 0,01 g sale.
618) Orzo perlato (a crudo) (confezionati): 350 kcal, 1,4 g grassi, 0,3 g grassi saturi, 72,0 g carboidrati, 0,8 g zuccheri, 9,0 g fibre, 10,0 g proteine, 0,01 g sale.
619) Grano saraceno in chicchi (confezionati): 343 kcal, 3,4 g grassi, 0,7 g grassi saturi, 62,0 g carboidrati, 0,0 g zuccheri, 10,0 g fibre, 13,0 g proteine, 0,01 g sale.
620) Risotto alla milanese (preparato secco busta): 360 kcal, 3,5 g grassi, 1,8 g grassi saturi, 72,0 g carboidrati, 1,5 g zuccheri, 1,2 g fibre, 8,0 g proteine, 2,50 g sale.
621) Paella surgelata (piatto pronto) (confezionati): 145 kcal, 5,5 g grassi, 1,2 g grassi saturi, 17,0 g carboidrati, 1,5 g zuccheri, 1,5 g fibre, 6,5 g proteine, 1,10 g sale.
622) Riso con verdure surgelato (da saltare) (confezionati): 120 kcal, 2,5 g grassi, 0,4 g grassi saturi, 20,0 g carboidrati, 1,8 g zuccheri, 2,2 g fibre, 3,0 g proteine, 0,80 g sale.
623) Riso Vialone Nano (confezionato): 348 kcal, 0,6 g grassi, 0,1 g grassi saturi, 78,0 g carboidrati, 0,3 g zuccheri, 1,0 g fibre, 7,2 g proteine, 0,01 g sale.
624) Riso Roma (confezionato): 350 kcal, 0,6 g grassi, 0,1 g grassi saturi, 79,0 g carboidrati, 0,3 g zuccheri, 1,0 g fibre, 7,0 g proteine, 0,01 g sale.
625) Riso Ribe (confezionati): 352 kcal, 0,7 g grassi, 0,1 g grassi saturi, 79,0 g carboidrati, 0,3 g zuccheri, 1,0 g fibre, 7,0 g proteine, 0,01 g sale.
626) Riso Originario (per minestre/dolci) (confezionati): 345 kcal, 0,6 g grassi, 0,1 g grassi saturi, 78,5 g carboidrati, 0,3 g zuccheri, 0,8 g fibre, 6,8 g proteine, 0,01 g sale.
627) Riso Thai Jasmine (confezionati): 355 kcal, 0,5 g grassi, 0,1 g grassi saturi, 80,0 g carboidrati, 0,2 g zuccheri, 1,0 g fibre, 7,5 g proteine, 0,01 g sale.
628) Riso Integrale Selvaggio (Zizania aquatica) (confezionati): 357 kcal, 1,1 g grassi, 0,2 g grassi saturi, 72,0 g carboidrati, 0,5 g zuccheri, 6,0 g fibre, 14,5 g proteine, 0,01 g sale.
629) Riso Glutinoso (per cucina asiatica) (confezionati): 365 kcal, 0,6 g grassi, 0,1 g grassi saturi, 82,0 g carboidrati, 0,1 g zuccheri, 1,0 g fibre, 6,5 g proteine, 0,01 g sale.
630) Riso Sushi (Arborio a chicco corto) (confezionati): 350 kcal, 0,6 g grassi, 0,1 g grassi saturi, 78,0 g carboidrati, 0,1 g zuccheri, 1,0 g fibre, 6,5 g proteine, 0,01 g sale.
631) Riso Ermes (Rosso integrale aromatico) (confezionati): 352 kcal, 2,3 g grassi, 0,5 g grassi saturi, 72,0 g carboidrati, 0,8 g zuccheri, 3,8 g fibre, 8,5 g proteine, 0,01 g sale.
632) Riso Basmati cotto a vapore (in busta microondabile) (confezionati): 155 kcal, 2,5 g grassi, 0,3 g grassi saturi, 29,0 g carboidrati, 0,2 g zuccheri, 1,2 g fibre, 3,5 g proteine, 0,40 g sale.
633) Riso integrale e Quinoa cotto (in busta) (confezionati): 165 kcal, 3,5 g grassi, 0,5 g grassi saturi, 28,0 g carboidrati, 0,5 g zuccheri, 3,5 g fibre, 4,5 g proteine, 0,50 g sale.
634) Riso per insalate (Pezzi precotti/3 minuti) (confezionati): 350 kcal, 0,8 g grassi, 0,2 g grassi saturi, 77,0 g carboidrati, 0,5 g zuccheri, 2,0 g fibre, 7,5 g proteine, 0,01 g sale.
635) Tagliatelle di riso integrale (confezionate): 350 kcal, 2,8 g grassi, 0,6 g grassi saturi, 72,0 g carboidrati, 0,8 g zuccheri, 4,0 g fibre, 7,5 g proteine, 0,05 g sale.
636) Vermicelli di riso (confezionati): 355 kcal, 0,5 g grassi, 0,1 g grassi saturi, 81,0 g carboidrati, 0,2 g zuccheri, 1,0 g fibre, 6,0 g proteine, 0,10 g sale.
637) Penne di riso nero (confezionate): 345 kcal, 2,2 g grassi, 0,5 g grassi saturi, 71,0 g carboidrati, 0,7 g zuccheri, 4,5 g fibre, 8,0 g proteine, 0,01 g sale.
638) Mix 5 cereali (riso, farro, orzo, avena, segale) (confezionati): 350 kcal, 2,0 g grassi, 0,4 g grassi saturi, 68,0 g carboidrati, 1,2 g zuccheri, 7,0 g fibre, 11,5 g proteine, 0,01 g sale.
639) Latte intero (confezionato): 64 kcal, 3,6 g grassi, 2,3 g grassi saturi, 4,8 g carboidrati, 4,8 g zuccheri, 0 g fibre, 3,3 g proteine, 0,10 g sale.
640) Latte intero SL (confezionato): 64 kcal, 3,6 g grassi, 2,3 g grassi saturi, 4,9 g carboidrati, 4,9 g zuccheri, 0 g fibre, 3,3 g proteine, 0,10 g sale.
641) Latte parzialmente scremato (confezionato): 46 kcal, 1,6 g grassi, 1,0 g grassi saturi, 4,9 g carboidrati, 4,9 g zuccheri, 0 g fibre, 3,4 g proteine, 0,10 g sale.
642) Latte parzialmente scremato SL (confezionato): 46 kcal, 1,6 g grassi, 1,0 g grassi saturi, 5,0 g carboidrati, 5,0 g zuccheri, 0 g fibre, 3,4 g proteine, 0,10 g sale.
643) Latte scremato (confezionato): 34 kcal, 0,2 g grassi, 0,1 g grassi saturi, 5,0 g carboidrati, 5,0 g zuccheri, 0 g fibre, 3,5 g proteine, 0,11 g sale.
644) Latte scremato SL (confezionato): 34 kcal, 0,2 g grassi, 0,1 g grassi saturi, 5,1 g carboidrati, 5,1 g zuccheri, 0 g fibre, 3,5 g proteine, 0,11 g sale.
645) Panna da cucina (confezionata): 220 kcal, 21,5 g grassi, 14,0 g grassi saturi, 3,8 g carboidrati, 3,5 g zuccheri, 0 g fibre, 3,0 g proteine, 0,10 g sale.
646) Panna da cucina SL (confezionata): 218 kcal, 21,5 g grassi, 14,0 g grassi saturi, 4,0 g carboidrati, 4,0 g zuccheri, 0 g fibre, 3,0 g proteine, 0,10 g sale.
647) Besciamella pronta (confezionata): 160 kcal, 10,0 g grassi, 6,5 g grassi saturi, 13,0 g carboidrati, 4,5 g zuccheri, 0,5 g fibre, 4,5 g proteine, 0,80 g sale.
648) Besciamella pronta SL (confezionata): 155 kcal, 9,5 g grassi, 6,0 g grassi saturi, 14,0 g carboidrati, 5,0 g zuccheri, 0,5 g fibre, 4,2 g proteine, 0,85 g sale.
649) Yogurt greco alla frutta (confezionato): 110 kcal, 4,0 g grassi, 2,8 g grassi saturi, 12,0 g carboidrati, 11,0 g zuccheri, 0,5 g fibre, 7,5 g proteine, 0,12 g sale.
650) Yogurt greco alla frutta SL (confezionato): 108 kcal, 4,0 g grassi, 2,8 g grassi saturi, 13,0 g carboidrati, 12,5 g zuccheri, 0,5 g fibre, 7,0 g proteine, 0,12 g sale.
651) Yogurt da bere (confezionato): 75 kcal, 1,5 g grassi, 1,0 g grassi saturi, 12,0 g carboidrati, 11,5 g zuccheri, 0 g fibre, 2,8 g proteine, 0,11 g sale.
652) Yogurt da bere SL (confezionato): 75 kcal, 1,5 g grassi, 1,0 g grassi saturi, 13,0 g carboidrati, 12,5 g zuccheri, 0 g fibre, 2,8 g proteine, 0,11 g sale.
653) Fontal (confezionato): 340 kcal, 26,0 g grassi, 18,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 24,0 g proteine, 1,60 g sale.
654) Fontal SL (confezionato): 335 kcal, 25,5 g grassi, 17,5 g grassi saturi, 1,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 23,5 g proteine, 1,65 g sale.
655) Montasio DOP: 370 kcal, 30,0 g grassi, 20,0 g grassi saturi, 0,5 g carboidrati, 0 g zuccheri, 0 g fibre, 25,0 g proteine, 1,70 g sale.
656) Puzzone di Moena: 350 kcal, 28,0 g grassi, 19,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 24,5 g proteine, 1,90 g sale.
657) Provolone Dolce (confezionato): 365 kcal, 28,5 g grassi, 19,0 g grassi saturi, 1,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 25,5 g proteine, 2,00 g sale.
658) Provolone Dolce SL (confezionato): 360 kcal, 28,0 g grassi, 18,5 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 25,0 g proteine, 2,10 g sale.
659) Provolone Piccante: 375 kcal, 30,0 g grassi, 20,0 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 0 g fibre, 26,0 g proteine, 2,50 g sale.
660) Cheddar (confezionato): 400 kcal, 33,0 g grassi, 21,0 g grassi saturi, 0,1 g carboidrati, 0,1 g zuccheri, 0 g fibre, 25,0 g proteine, 1,80 g sale.
661) Cheddar SL (confezionato): 395 kcal, 32,5 g grassi, 20,5 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 24,5 g proteine, 1,85 g sale.
662) Gouda (confezionato): 350 kcal, 27,0 g grassi, 18,0 g grassi saturi, 0,1 g carboidrati, 0,1 g zuccheri, 0 g fibre, 25,0 g proteine, 1,90 g sale.
663) Gouda SL (confezionato): 345 kcal, 26,5 g grassi, 17,5 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 24,5 g proteine, 1,95 g sale.
664) Bra Duro DOP: 375 kcal, 29,0 g grassi, 20,0 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 28,0 g proteine, 2,20 g sale.
665) Castelmagno DOP: 380 kcal, 30,0 g grassi, 21,0 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 0 g fibre, 24,0 g proteine, 2,00 g sale.
666) Primo Sale (confezionato): 245 kcal, 19,0 g grassi, 13,0 g grassi saturi, 2,0 g carboidrati, 2,0 g zuccheri, 0 g fibre, 16,5 g proteine, 1,30 g sale.
667) Primo Sale SL (confezionato): 240 kcal, 18,5 g grassi, 12,5 g grassi saturi, 2,5 g carboidrati, 2,5 g zuccheri, 0 g fibre, 16,0 g proteine, 1,35 g sale.
668) Tomino da piastra (confezionato): 280 kcal, 23,0 g grassi, 16,0 g grassi saturi, 1,0 g carboidrati, 1,0 g zuccheri, 0 g fibre, 17,0 g proteine, 1,10 g sale.
669) Tomino da piastra SL (confezionato): 275 kcal, 22,5 g grassi, 15,5 g grassi saturi, 1,5 g carboidrati, 1,5 g zuccheri, 0 g fibre, 16,5 g proteine, 1,15 g sale.
670) Formaggino classico (confezionato): 230 kcal, 17,0 g grassi, 11,0 g grassi saturi, 6,0 g carboidrati, 6,0 g zuccheri, 0 g fibre, 13,0 g proteine, 2,20 g sale.
671) Formaggino SL (confezionato): 225 kcal, 16,5 g grassi, 10,5 g grassi saturi, 7,0 g carboidrati, 7,0 g zuccheri, 0 g fibre, 12,5 g proteine, 2,30 g sale.
672) Giuncata (fresca): 180 kcal, 14,0 g grassi, 9,5 g grassi saturi, 3,0 g carboidrati, 3,0 g zuccheri, 0 g fibre, 11,0 g proteine, 0,60 g sale.
673) Robiola vaccina (confezionata): 310 kcal, 30,0 g grassi, 21,0 g grassi saturi, 2,5 g carboidrati, 2,5 g zuccheri, 0 g fibre, 8,5 g proteine, 0,80 g sale.
674) Robiola SL (confezionata): 305 kcal, 29,5 g grassi, 20,5 g grassi saturi, 3,0 g carboidrati, 3,0 g zuccheri, 0 g fibre, 8,0 g proteine, 0,85 g sale.
675) Yogurt greco ai cereali (confezionato): 120 kcal, 3,5 g grassi, 2,0 g grassi saturi, 14,0 g carboidrati, 11,0 g zuccheri, 1,0 g fibre, 7,5 g proteine, 0,15 g sale.
676) Yogurt greco ai cereali SL (confezionato): 118 kcal, 3,5 g grassi, 2,0 g grassi saturi, 15,0 g carboidrati, 13,0 g zuccheri, 1,0 g fibre, 7,2 g proteine, 0,16 g sale.
677) Yogurt greco al caffÃ¨ (confezionato): 105 kcal, 4,0 g grassi, 2,8 g grassi saturi, 10,0 g carboidrati, 9,5 g zuccheri, 0 g fibre, 7,0 g proteine, 0,12 g sale.
678) Yogurt greco al caffÃ¨ SL (confezionato): 105 kcal, 4,0 g grassi, 2,8 g grassi saturi, 11,0 g carboidrati, 10,5 g zuccheri, 0 g fibre, 7,0 g proteine, 0,12 g sale.
679) Yogurt bifidus bianco (confezionato): 65 kcal, 3,5 g grassi, 2,3 g grassi saturi, 5,0 g carboidrati, 5,0 g zuccheri, 0 g fibre, 3,5 g proteine, 0,11 g sale.
680) Yogurt bifidus bianco SL (confezionato): 65 kcal, 3,5 g grassi, 2,3 g grassi saturi, 5,5 g carboidrati, 5,5 g zuccheri, 0 g fibre, 3,5 g proteine, 0,11 g sale.
681) Bitto DOP (formaggio valtellinese): 395 kcal, 32 g grassi, 22 g grassi saturi, 0,5 g carboidrati, 0 g zuccheri, 0 g fibre, 26 g proteine, 1,80 g sale.
682) Bitto SL (confezionato): 390 kcal, 31,5 g grassi, 21,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 25,5 g proteine, 1,85 g sale.
683) Caciocavallo Silano DOP: 438 kcal, 34 g grassi, 22 g grassi saturi, 1,5 g carboidrati, 1,0 g zuccheri, 0 g fibre, 31 g proteine, 2,00 g sale.
684) Caciocavallo SL (confezionato): 432 kcal, 33,5 g grassi, 21,5 g grassi saturi, 2,0 g carboidrati, 1,5 g zuccheri, 0 g fibre, 30,5 g proteine, 2,10 g sale.
685) Casatella Trevigiana DOP: 246 kcal, 20 g grassi, 14 g grassi saturi, 2,8 g carboidrati, 2,8 g zuccheri, 0 g fibre, 14 g proteine, 0,80 g sale.
686) Casatella SL (confezionata): 242 kcal, 19,5 g grassi, 13,5 g grassi saturi, 3,2 g carboidrati, 3,2 g zuccheri, 0 g fibre, 13,5 g proteine, 0,85 g sale.
687) Piave DOP (Vecchio): 450 kcal, 35 g grassi, 24 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 33 g proteine, 1,90 g sale.
688) Piave SL (confezionato): 445 kcal, 34,5 g grassi, 23,5 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 32,5 g proteine, 1,95 g sale.
689) Quartirolo Lombardo DOP: 295 kcal, 25 g grassi, 17 g grassi saturi, 1,5 g carboidrati, 1,5 g zuccheri, 0 g fibre, 17 g proteine, 1,50 g sale.
690) Quartirolo SL (confezionato): 290 kcal, 24,5 g grassi, 16,5 g grassi saturi, 2,0 g carboidrati, 2,0 g zuccheri, 0 g fibre, 16,5 g proteine, 1,55 g sale.
691) Ragusano DOP: 390 kcal, 31 g grassi, 21 g grassi saturi, 0,5 g carboidrati, 0,2 g zuccheri, 0 g fibre, 28 g proteine, 2,20 g sale.
692) Ragusano SL (confezionato): 385 kcal, 30,5 g grassi, 20,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 27,5 g proteine, 2,25 g sale.
693) Bra DOP (Tenero): 345 kcal, 27 g grassi, 18 g grassi saturi, 0,8 g carboidrati, 0,5 g zuccheri, 0 g fibre, 24 g proteine, 1,60 g sale.
694) Bra SL (confezionato): 340 kcal, 26,5 g grassi, 17,5 g grassi saturi, 1,2 g carboidrati, 1,0 g zuccheri, 0 g fibre, 23,5 g proteine, 1,65 g sale.
695) Roquefort (erborinato francese): 369 kcal, 30,6 g grassi, 19,5 g grassi saturi, 2,0 g carboidrati, 0 g zuccheri, 0 g fibre, 21,5 g proteine, 3,50 g sale.
696) Roquefort SL (certificato): 365 kcal, 30,0 g grassi, 19,0 g grassi saturi, 2,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 21,0 g proteine, 3,60 g sale.
697) Le GruyÃ¨re (Groviera svizzera): 413 kcal, 32,3 g grassi, 19 g grassi saturi, 0,4 g carboidrati, 0,1 g zuccheri, 0 g fibre, 29,8 g proteine, 1,50 g sale.
698) Le GruyÃ¨re SL (confezionato): 410 kcal, 32,0 g grassi, 18,5 g grassi saturi, 0,8 g carboidrati, 0,5 g zuccheri, 0 g fibre, 29,0 g proteine, 1,55 g sale.
699) Manchego (pecora spagnolo): 420 kcal, 35,5 g grassi, 23,5 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 24,0 g proteine, 1,80 g sale.
700) Manchego SL (confezionato): 415 kcal, 35,0 g grassi, 23,0 g grassi saturi, 1,5 g carboidrati, 1,0 g zuccheri, 0 g fibre, 23,5 g proteine, 1,85 g sale.
701) Halloumi (da griglia): 320 kcal, 24,0 g grassi, 16,0 g grassi saturi, 2,0 g carboidrati, 2,0 g zuccheri, 0 g fibre, 22,0 g proteine, 2,80 g sale.
702) Halloumi SL (confezionato): 315 kcal, 23,5 g grassi, 15,5 g grassi saturi, 2,5 g carboidrati, 2,5 g zuccheri, 0 g fibre, 21,5 g proteine, 2,90 g sale.
703) Caciotta di Capra stagionata: 398 kcal, 32,0 g grassi, 22,0 g grassi saturi, 0,9 g carboidrati, 0,5 g zuccheri, 0 g fibre, 26,0 g proteine, 1,60 g sale.
704) Caciotta di Capra SL (confezionata): 392 kcal, 31,5 g grassi, 21,5 g grassi saturi, 1,4 g carboidrati, 1,0 g zuccheri, 0 g fibre, 25,5 g proteine, 1,65 g sale.
705) Cacioricotta: 280 kcal, 22,0 g grassi, 15,0 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 17,0 g proteine, 2,50 g sale.
706) Cacioricotta SL (confezionata): 275 kcal, 21,5 g grassi, 14,5 g grassi saturi, 4,0 g carboidrati, 4,0 g zuccheri, 0 g fibre, 16,5 g proteine, 2,60 g sale.
707) Ricotta Salata: 290 kcal, 23,0 g grassi, 16,0 g grassi saturi, 3,0 g carboidrati, 3,0 g zuccheri, 0 g fibre, 18,0 g proteine, 4,00 g sale.
708) Ricotta Salata SL (confezionata): 285 kcal, 22,5 g grassi, 15,5 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 17,5 g proteine, 4,10 g sale.
709) Fiocchi di latte alle verdure: 95 kcal, 4,2 g grassi, 2,8 g grassi saturi, 3,0 g carboidrati, 3,0 g zuccheri, 0,5 g fibre, 10,9 g proteine, 0,80 g sale.
710) Fiocchi di latte alle verdure SL (confezionati): 92 kcal, 4,0 g grassi, 2,5 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0,5 g fibre, 10,5 g proteine, 0,85 g sale.
711) Mousse di formaggio fresco Light: 140 kcal, 8,0 g grassi, 5,5 g grassi saturi, 6,5 g carboidrati, 6,0 g zuccheri, 0 g fibre, 9,5 g proteine, 0,80 g sale.
712) Mousse di formaggio fresco Light SL (confezionata): 135 kcal, 7,5 g grassi, 5,0 g grassi saturi, 7,0 g carboidrati, 6,5 g zuccheri, 0 g fibre, 9,0 g proteine, 0,85 g sale.
713) Yogurt al malto e miele (confezionato): 110 kcal, 3,2 g grassi, 2,1 g grassi saturi, 16,0 g carboidrati, 15,5 g zuccheri, 0 g fibre, 3,8 g proteine, 0,12 g sale.
714) Yogurt al malto e miele SL (confezionato): 110 kcal, 3,2 g grassi, 2,1 g grassi saturi, 17,0 g carboidrati, 16,5 g zuccheri, 0 g fibre, 3,5 g proteine, 0,13 g sale.
715) Kefir aromatizzato alla fragola (confezionato): 85 kcal, 1,5 g grassi, 1,0 g grassi saturi, 13,0 g carboidrati, 12,5 g zuccheri, 0,2 g fibre, 3,2 g proteine, 0,10 g sale.
716) Kefir alla fragola SL (confezionato): 85 kcal, 1,5 g grassi, 1,0 g grassi saturi, 14,0 g carboidrati, 13,5 g zuccheri, 0,2 g fibre, 3,0 g proteine, 0,11 g sale.
717) Budino al cioccolato (confezionato): 130 kcal, 3,5 g grassi, 2,3 g grassi saturi, 21,0 g carboidrati, 18,0 g zuccheri, 0,8 g fibre, 3,5 g proteine, 0,15 g sale.
718) Budino al cioccolato SL (confezionato): 125 kcal, 3,2 g grassi, 2,1 g grassi saturi, 22,0 g carboidrati, 19,0 g zuccheri, 0,8 g fibre, 3,3 g proteine, 0,16 g sale.
719) Budino alla vaniglia (confezionato): 115 kcal, 3,0 g grassi, 2,0 g grassi saturi, 19,0 g carboidrati, 16,0 g zuccheri, 0 g fibre, 3,2 g proteine, 0,14 g sale.
720) Budino alla vaniglia SL (confezionato): 112 kcal, 2,8 g grassi, 1,8 g grassi saturi, 20,0 g carboidrati, 17,5 g zuccheri, 0 g fibre, 3,0 g proteine, 0,15 g sale.
721) Mousse al latte (confezionata): 160 kcal, 10,0 g grassi, 7,0 g grassi saturi, 14,0 g carboidrati, 13,0 g zuccheri, 0 g fibre, 3,8 g proteine, 0,12 g sale.
722) Mousse al latte SL (confezionata): 158 kcal, 9,8 g grassi, 6,8 g grassi saturi, 15,0 g carboidrati, 14,5 g zuccheri, 0 g fibre, 3,5 g proteine, 0,13 g sale.
723) Panna spray (confezionata): 260 kcal, 25,0 g grassi, 17,0 g grassi saturi, 7,0 g carboidrati, 7,0 g zuccheri, 0 g fibre, 2,2 g proteine, 0,10 g sale.
724) Panna spray SL (confezionata): 255 kcal, 24,5 g grassi, 16,5 g grassi saturi, 8,0 g carboidrati, 8,0 g zuccheri, 0 g fibre, 2,0 g proteine, 0,10 g sale.
725) Budino proteico al cioccolato (confezionato): 80 kcal, 1,5 g grassi, 1,0 g grassi saturi, 6,0 g carboidrati, 4,5 g zuccheri, 0,5 g fibre, 10,0 g proteine, 0,15 g sale.
726) Budino proteico al cioccolato SL (confezionato): 80 kcal, 1,5 g grassi, 1,0 g grassi saturi, 6,5 g carboidrati, 4,8 g zuccheri, 0,5 g fibre, 10,0 g proteine, 0,15 g sale.
727) Budino proteico alla vaniglia (confezionato): 75 kcal, 1,2 g grassi, 0,8 g grassi saturi, 5,5 g carboidrati, 4,0 g zuccheri, 0 g fibre, 10,0 g proteine, 0,14 g sale.
728) Budino proteico al caramello SL (confezionato): 78 kcal, 1,4 g grassi, 0,9 g grassi saturi, 6,0 g carboidrati, 4,2 g zuccheri, 0 g fibre, 10,0 g proteine, 0,15 g sale.
729) Bevanda proteica al latte (Milkshake) (confezionata): 60 kcal, 0,8 g grassi, 0,5 g grassi saturi, 5,0 g carboidrati, 4,8 g zuccheri, 0 g fibre, 8,0 g proteine, 0,10 g sale.
730) Bevanda proteica al latte SL (confezionata): 60 kcal, 0,8 g grassi, 0,5 g grassi saturi, 5,2 g carboidrati, 5,0 g zuccheri, 0 g fibre, 8,0 g proteine, 0,11 g sale.
731) Latte di capra intero (confezionato): 69 kcal, 4,1 g grassi, 2,7 g grassi saturi, 4,5 g carboidrati, 4,5 g zuccheri, 0 g fibre, 3,5 g proteine, 0,12 g sale.
732) Latte di capra parzialmente scremato (confezionato): 48 kcal, 1,8 g grassi, 1,2 g grassi saturi, 4,6 g carboidrati, 4,6 g zuccheri, 0 g fibre, 3,4 g proteine, 0,12 g sale.
733) Latte di pecora (fresco/confezionato): 108 kcal, 7,0 g grassi, 4,8 g grassi saturi, 5,4 g carboidrati, 5,4 g zuccheri, 0 g fibre, 6,0 g proteine, 0,15 g sale.
734) Latte condensato zuccherato (confezionato): 320 kcal, 8,0 g grassi, 5,5 g grassi saturi, 55,0 g carboidrati, 55,0 g zuccheri, 0 g fibre, 7,5 g proteine, 0,25 g sale.
735) Latte condensato SL (confezionato): 315 kcal, 8,0 g grassi, 5,5 g grassi saturi, 56,0 g carboidrati, 56,0 g zuccheri, 0 g fibre, 7,2 g proteine, 0,26 g sale.
736) Latte evaporato (non zuccherato) (confezionato): 135 kcal, 7,5 g grassi, 5,0 g grassi saturi, 10,0 g carboidrati, 10,0 g zuccheri, 0 g fibre, 7,0 g proteine, 0,20 g sale.
737) Yogurt di capra bianco (confezionato): 72 kcal, 4,2 g grassi, 2,8 g grassi saturi, 4,2 g carboidrati, 4,2 g zuccheri, 0 g fibre, 3,8 g proteine, 0,12 g sale.
738) Labneh (formaggio di yogurt): 160 kcal, 12,0 g grassi, 8,0 g grassi saturi, 4,5 g carboidrati, 4,0 g zuccheri, 0 g fibre, 8,5 g proteine, 0,80 g sale.
739) Formaggio spalmabile alle erbe (confezionato): 235 kcal, 21,5 g grassi, 14,5 g grassi saturi, 4,0 g carboidrati, 3,5 g zuccheri, 0,5 g fibre, 5,5 g proteine, 1,10 g sale.
740) Formaggio spalmabile alle erbe SL (confezionato): 230 kcal, 21,0 g grassi, 14,0 g grassi saturi, 4,5 g carboidrati, 4,0 g zuccheri, 0,5 g fibre, 5,2 g proteine, 1,15 g sale.
741) Mousse di formaggio fresco (confezionata): 250 kcal, 23,0 g grassi, 16,0 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 6,5 g proteine, 0,90 g sale.
742) Tonno all'olio di oliva sgocciolato (confezionati): 190 kcal, 10,0 g grassi, 1,6 g grassi saturi, 0,0 g carboidrati, 0,0 g zuccheri, 0,0 g fibre, 25,0 g proteine, 1,10 g sale.
743) Tonno al naturale sgocciolato (confezionati): 102 kcal, 0,6 g grassi, 0,1 g grassi saturi, 0,0 g carboidrati, 0,0 g zuccheri, 0,0 g fibre, 24,0 g proteine, 1,20 g sale.
744) Sgombro all'olio di oliva sgocciolato (confezionati): 210 kcal, 13,5 g grassi, 3,0 g grassi saturi, 0,0 g carboidrati, 0,0 g zuccheri, 0,0 g fibre, 22,0 g proteine, 1,20 g sale.
745) Sardine sott'olio sgocciolate (confezionati): 208 kcal, 11,5 g grassi, 2,8 g grassi saturi, 0,0 g carboidrati, 0,0 g zuccheri, 0,0 g fibre, 25,0 g proteine, 1,30 g sale.
746) Acciughe sott'olio sgocciolate (confezionati): 210 kcal, 10,0 g grassi, 2,2 g grassi saturi, 0,0 g carboidrati, 0,0 g zuccheri, 0,0 g fibre, 28,0 g proteine, 12,0 g sale.
747) Pomodoro da insalata: 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,9 g carboidrati, 2,6 g zuccheri, 1,2 g fibre, 0,9 g proteine, 0,01 g sale.
748) Pomodorino Ciliegino: 22 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 3,5 g zuccheri, 1,5 g fibre, 1,0 g proteine, 0,01 g sale.
749) Zucchina scura: 16 kcal, 0,3 g grassi, 0,1 g grassi saturi, 3,1 g carboidrati, 2,5 g zuccheri, 1,1 g fibre, 1,2 g proteine, 0,02 g sale.
750) Melanzana: 25 kcal, 0,2 g grassi, 0,0 g grassi saturi, 6,0 g carboidrati, 3,5 g zuccheri, 3,0 g fibre, 1,0 g proteine, 0,01 g sale.
751) Peperone Rosso: 31 kcal, 0,3 g grassi, 0,0 g grassi saturi, 6,0 g carboidrati, 4,2 g zuccheri, 2,1 g fibre, 1,0 g proteine, 0,01 g sale.
752) Peperone Giallo: 27 kcal, 0,2 g grassi, 0,0 g grassi saturi, 5,4 g carboidrati, 4,0 g zuccheri, 1,9 g fibre, 1,0 g proteine, 0,01 g sale.
753) Peperone Verde: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,6 g carboidrati, 2,4 g zuccheri, 1,8 g fibre, 0,9 g proteine, 0,01 g sale.
754) Cetriolo: 15 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,6 g carboidrati, 1,7 g zuccheri, 0,5 g fibre, 0,7 g proteine, 0,01 g sale.
755) Carota: 41 kcal, 0,2 g grassi, 0,0 g grassi saturi, 9,6 g carboidrati, 4,7 g zuccheri, 2,8 g fibre, 0,9 g proteine, 0,07 g sale.
756) Zucca Gialla: 26 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,5 g carboidrati, 2,8 g zuccheri, 0,5 g fibre, 1,0 g proteine, 0,01 g sale.
757) Rapanello: 16 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,4 g carboidrati, 1,9 g zuccheri, 1,6 g fibre, 0,7 g proteine, 0,04 g sale.
758) Lattuga Romana: 17 kcal, 0,3 g grassi, 0,0 g grassi saturi, 3,3 g carboidrati, 1,2 g zuccheri, 2,1 g fibre, 1,2 g proteine, 0,02 g sale.
759) Iceberg: 14 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,0 g carboidrati, 2,0 g zuccheri, 1,2 g fibre, 0,9 g proteine, 0,03 g sale.
760) Spinaci freschi: 23 kcal, 0,4 g grassi, 0,1 g grassi saturi, 3,6 g carboidrati, 0,4 g zuccheri, 2,2 g fibre, 2,9 g proteine, 0,08 g sale.
761) Rucola: 25 kcal, 0,7 g grassi, 0,1 g grassi saturi, 3,7 g carboidrati, 2,0 g zuccheri, 1,6 g fibre, 2,6 g proteine, 0,03 g sale.
762) Bietola da coste: 19 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,7 g carboidrati, 1,1 g zuccheri, 1,6 g fibre, 1,8 g proteine, 0,20 g sale.
763) Radicchio Rosso: 23 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 0,6 g zuccheri, 0,9 g fibre, 1,4 g proteine, 0,01 g sale.
764) Indivia Belga: 17 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 0,7 g zuccheri, 3,1 g fibre, 1,2 g proteine, 0,01 g sale.
765) Scarola: 15 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,4 g carboidrati, 0,3 g zuccheri, 2,0 g fibre, 1,2 g proteine, 0,02 g sale.
766) Cavolo Nero: 49 kcal, 0,9 g grassi, 0,1 g grassi saturi, 8,8 g carboidrati, 2,3 g zuccheri, 3,6 g fibre, 4,3 g proteine, 0,04 g sale.
767) Cicoria: 23 kcal, 0,3 g grassi, 0,0 g grassi saturi, 4,7 g carboidrati, 0,7 g zuccheri, 4,0 g fibre, 1,7 g proteine, 0,04 g sale.
768) Broccolo: 34 kcal, 0,4 g grassi, 0,0 g grassi saturi, 6,6 g carboidrati, 1,7 g zuccheri, 2,6 g fibre, 2,8 g proteine, 0,03 g sale.
769) Cavolfiore: 25 kcal, 0,3 g grassi, 0,1 g grassi saturi, 5,0 g carboidrati, 1,9 g zuccheri, 2,0 g fibre, 1,9 g proteine, 0,03 g sale.
770) Cavolini di Bruxelles: 43 kcal, 0,3 g grassi, 0,1 g grassi saturi, 9,0 g carboidrati, 2,2 g zuccheri, 3,8 g fibre, 3,4 g proteine, 0,02 g sale.
771) Verza: 27 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,0 g carboidrati, 3,2 g zuccheri, 2,5 g fibre, 2,0 g proteine, 0,02 g sale.
772) Cavolo Cappuccio: 25 kcal, 0,1 g grassi, 0,0 g grassi saturi, 5,8 g carboidrati, 3,2 g zuccheri, 2,5 g fibre, 1,3 g proteine, 0,02 g sale.
773) Cime di Rapa: 22 kcal, 0,4 g grassi, 0,0 g grassi saturi, 3,0 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 3,0 g proteine, 0,03 g sale.
774) Cavolo Romanesco: 31 kcal, 0,3 g grassi, 0,0 g grassi saturi, 5,3 g carboidrati, 2,1 g zuccheri, 2,2 g fibre, 2,3 g proteine, 0,04 g sale.
775) Patata comune: 77 kcal, 0,1 g grassi, 0,0 g grassi saturi, 17,5 g carboidrati, 0,8 g zuccheri, 2,2 g fibre, 2,0 g proteine, 0,01 g sale.
776) Patata Dolce (Americana): 86 kcal, 0,1 g grassi, 0,0 g grassi saturi, 20,1 g carboidrati, 4,2 g zuccheri, 3,0 g fibre, 1,6 g proteine, 0,05 g sale.
777) Cipolla Bianca: 40 kcal, 0,1 g grassi, 0,0 g grassi saturi, 9,3 g carboidrati, 4,2 g zuccheri, 1,7 g fibre, 1,1 g proteine, 0,01 g sale.
778) Cipolla Rossa: 37 kcal, 0,1 g grassi, 0,0 g grassi saturi, 8,2 g carboidrati, 4,5 g zuccheri, 1,5 g fibre, 1,0 g proteine, 0,01 g sale.
779) Scalogno: 72 kcal, 0,1 g grassi, 0,0 g grassi saturi, 16,8 g carboidrati, 7,9 g zuccheri, 3,2 g fibre, 2,5 g proteine, 0,01 g sale.
780) Aglio (100g): 149 kcal, 0,5 g grassi, 0,1 g grassi saturi, 33,0 g carboidrati, 1,0 g zuccheri, 2,1 g fibre, 6,4 g proteine, 0,02 g sale.
781) Porro: 61 kcal, 0,3 g grassi, 0,0 g grassi saturi, 14,0 g carboidrati, 3,9 g zuccheri, 1,8 g fibre, 1,5 g proteine, 0,02 g sale.
782) Finocchio: 31 kcal, 0,2 g grassi, 0,0 g grassi saturi, 7,3 g carboidrati, 3,9 g zuccheri, 3,1 g fibre, 1,2 g proteine, 0,05 g sale.
783) Sedano: 16 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,0 g carboidrati, 1,8 g zuccheri, 1,6 g fibre, 0,7 g proteine, 0,08 g sale.
784) Asparago: 20 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,9 g carboidrati, 1,9 g zuccheri, 2,1 g fibre, 2,2 g proteine, 0,01 g sale.
785) Carciofo: 47 kcal, 0,2 g grassi, 0,0 g grassi saturi, 10,5 g carboidrati, 1,0 g zuccheri, 5,4 g fibre, 3,3 g proteine, 0,09 g sale.
786) Topinambur: 73 kcal, 0,0 g grassi, 0,0 g grassi saturi, 17,4 g carboidrati, 9,6 g zuccheri, 1,6 g fibre, 2,0 g proteine, 0,01 g sale.
787) Barbabietola Rossa: 43 kcal, 0,2 g grassi, 0,0 g grassi saturi, 10,0 g carboidrati, 6,8 g zuccheri, 2,8 g fibre, 1,6 g proteine, 0,08 g sale.
788) Fagiolini: 31 kcal, 0,2 g grassi, 0,0 g grassi saturi, 7,0 g carboidrati, 3,3 g zuccheri, 3,4 g fibre, 1,8 g proteine, 0,01 g sale.
789) Piselli freschi: 81 kcal, 0,4 g grassi, 0,1 g grassi saturi, 14,5 g carboidrati, 5,7 g zuccheri, 5,1 g fibre, 5,4 g proteine, 0,01 g sale.
790) Fave fresche: 88 kcal, 0,7 g grassi, 0,1 g grassi saturi, 17,6 g carboidrati, 4,9 g zuccheri, 7,5 g fibre, 8,0 g proteine, 0,01 g sale.
791) Taccole: 42 kcal, 0,2 g grassi, 0,0 g grassi saturi, 7,5 g carboidrati, 4,0 g zuccheri, 2,6 g fibre, 2,8 g proteine, 0,01 g sale.
792) Funghi Champignon: 22 kcal, 0,3 g grassi, 0,1 g grassi saturi, 3,3 g carboidrati, 2,0 g zuccheri, 1,0 g fibre, 3,1 g proteine, 0,01 g sale.
793) Funghi Porcini: 26 kcal, 0,4 g grassi, 0,1 g grassi saturi, 3,0 g carboidrati, 1,2 g zuccheri, 2,5 g fibre, 3,9 g proteine, 0,01 g sale.
794) Funghi Pleurotus: 33 kcal, 0,4 g grassi, 0,1 g grassi saturi, 6,0 g carboidrati, 1,1 g zuccheri, 2,3 g fibre, 3,3 g proteine, 0,01 g sale.
795) Sedano Rapa: 42 kcal, 0,3 g grassi, 0,1 g grassi saturi, 9,2 g carboidrati, 1,8 g zuccheri, 1,8 g fibre, 1,5 g proteine, 0,10 g sale.
796) Pastinaca: 75 kcal, 0,3 g grassi, 0,1 g grassi saturi, 18,0 g carboidrati, 4,8 g zuccheri, 4,9 g fibre, 1,2 g proteine, 0,01 g sale.
797) Zenzero fresco: 80 kcal, 0,8 g grassi, 0,2 g grassi saturi, 17,8 g carboidrati, 1,7 g zuccheri, 2,0 g fibre, 1,8 g proteine, 0,01 g sale.
798) Daikon (Rafano bianco): 18 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,1 g carboidrati, 2,5 g zuccheri, 1,6 g fibre, 0,6 g proteine, 0,02 g sale.
799) Rapa bianca: 28 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,4 g carboidrati, 3,8 g zuccheri, 1,8 g fibre, 0,9 g proteine, 0,06 g sale.
800) Cetriolino sott'aceto: 11 kcal, 0,2 g grassi, 0,1 g grassi saturi, 2,3 g carboidrati, 1,1 g zuccheri, 1,2 g fibre, 0,5 g proteine, 1,20 g sale.
801) Mais dolce (pannocchia): 86 kcal, 1,2 g grassi, 0,2 g grassi saturi, 19,0 g carboidrati, 6,3 g zuccheri, 2,7 g fibre, 3,2 g proteine, 0,01 g sale.
802) Germogli di soia: 30 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,0 g carboidrati, 4,0 g zuccheri, 1,8 g fibre, 3,0 g proteine, 0,01 g sale.
803) BambÃ¹ (germogli): 27 kcal, 0,3 g grassi, 0,1 g grassi saturi, 5,2 g carboidrati, 3,0 g zuccheri, 2,2 g fibre, 2,6 g proteine, 0,01 g sale.
804) Okra (Gombo): 33 kcal, 0,2 g grassi, 0,0 g grassi saturi, 7,5 g carboidrati, 1,5 g zuccheri, 3,2 g fibre, 1,9 g proteine, 0,01 g sale.
805) Agretti (Barba di frate): 17 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,2 g carboidrati, 1,2 g zuccheri, 2,2 g fibre, 1,8 g proteine, 0,05 g sale.
806) Cardo: 17 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 1,5 g zuccheri, 1,6 g fibre, 0,7 g proteine, 0,17 g sale.
807) Valeriana (Songino): 21 kcal, 0,4 g grassi, 0,0 g grassi saturi, 3,6 g carboidrati, 1,0 g zuccheri, 1,0 g fibre, 2,0 g proteine, 0,01 g sale.
808) Crescione: 11 kcal, 0,1 g grassi, 0,0 g grassi saturi, 1,3 g carboidrati, 0,2 g zuccheri, 0,5 g fibre, 2,3 g proteine, 0,04 g sale.
809) Radicchio di Treviso: 23 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,4 g carboidrati, 0,5 g zuccheri, 3,0 g fibre, 1,4 g proteine, 0,01 g sale.
810) Puntarelle (Cicoria di catalogna): 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,8 g carboidrati, 0,7 g zuccheri, 2,1 g fibre, 1,5 g proteine, 0,03 g sale.
811) Pak Choi (Cavolo cinese): 13 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,2 g carboidrati, 1,2 g zuccheri, 1,0 g fibre, 1,5 g proteine, 0,06 g sale.
812) Verza Viola: 31 kcal, 0,2 g grassi, 0,0 g grassi saturi, 7,4 g carboidrati, 3,8 g zuccheri, 2,1 g fibre, 1,4 g proteine, 0,03 g sale.
813) Lollo Rossa (Insalata): 16 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,9 g carboidrati, 1,1 g zuccheri, 1,3 g fibre, 1,3 g proteine, 0,02 g sale.
814) Friarielli: 25 kcal, 0,4 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 0,6 g zuccheri, 2,8 g fibre, 2,9 g proteine, 0,03 g sale.
815) Truffle (Tartufo nero): 31 kcal, 0,7 g grassi, 0,1 g grassi saturi, 0,7 g carboidrati, 0,5 g zuccheri, 8,0 g fibre, 6,0 g proteine, 0,05 g sale.
816) Bok Choy: 13 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,2 g carboidrati, 1,2 g zuccheri, 1,0 g fibre, 1,5 g proteine, 0,06 g sale.
817) Radice di Loto: 74 kcal, 0,1 g grassi, 0,0 g grassi saturi, 17,2 g carboidrati, 0,5 g zuccheri, 4,9 g fibre, 2,6 g proteine, 0,04 g sale.
818) Chayote (Zucchina spinosa): 19 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 1,7 g zuccheri, 1,7 g fibre, 0,8 g proteine, 0,01 g sale.
819) Alga Nori (secca): 35 kcal, 0,3 g grassi, 0,1 g grassi saturi, 5,0 g carboidrati, 0,5 g zuccheri, 0,5 g fibre, 5,8 g proteine, 0,05 g sale.
820) Alga Wakame (fresca): 45 kcal, 0,6 g grassi, 0,1 g grassi saturi, 9,1 g carboidrati, 0,6 g zuccheri, 0,5 g fibre, 3,0 g proteine, 0,80 g sale.
821) Rabarbaro: 21 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 1,1 g zuccheri, 1,8 g fibre, 0,9 g proteine, 0,01 g sale.
822) Cavolo riccio (Kale): 49 kcal, 0,9 g grassi, 0,1 g grassi saturi, 8,8 g carboidrati, 2,3 g zuccheri, 3,6 g fibre, 4,3 g proteine, 0,04 g sale.
823) Portulaca: 16 kcal, 0,4 g grassi, 0,1 g grassi saturi, 3,4 g carboidrati, 0,1 g zuccheri, 0,0 g fibre, 1,3 g proteine, 0,04 g sale.
824) Borragine: 21 kcal, 0,7 g grassi, 0,1 g grassi saturi, 3,1 g carboidrati, 0,1 g zuccheri, 0,0 g fibre, 1,8 g proteine, 0,08 g sale.
825) Tarassaco (foglie): 45 kcal, 0,7 g grassi, 0,2 g grassi saturi, 9,2 g carboidrati, 0,7 g zuccheri, 3,5 g fibre, 2,7 g proteine, 0,07 g sale.
826) Ortica: 42 kcal, 0,1 g grassi, 0,0 g grassi saturi, 7,1 g carboidrati, 0,1 g zuccheri, 6,9 g fibre, 2,7 g proteine, 0,01 g sale.
827) Peperoncino piccante rosso: 40 kcal, 0,4 g grassi, 0,1 g grassi saturi, 8,8 g carboidrati, 5,3 g zuccheri, 1,5 g fibre, 1,9 g proteine, 0,01 g sale.
828) Rafano (radice): 48 kcal, 0,7 g grassi, 0,1 g grassi saturi, 11,3 g carboidrati, 8,0 g zuccheri, 3,3 g fibre, 1,2 g proteine, 0,01 g sale.
829) Cipollotto fresco: 32 kcal, 0,2 g grassi, 0,0 g grassi saturi, 7,3 g carboidrati, 2,3 g zuccheri, 2,6 g fibre, 1,8 g proteine, 0,02 g sale.
830) Scalogno fresco: 72 kcal, 0,1 g grassi, 0,0 g grassi saturi, 16,8 g carboidrati, 7,9 g zuccheri, 3,2 g fibre, 2,5 g proteine, 0,01 g sale.
831) Scorzonera: 82 kcal, 0,2 g grassi, 0,0 g grassi saturi, 18,6 g carboidrati, 1,0 g zuccheri, 3,3 g fibre, 3,3 g proteine, 0,02 g sale.
832) Patata Novella: 70 kcal, 0,1 g grassi, 0,0 g grassi saturi, 16,0 g carboidrati, 1,0 g zuccheri, 1,6 g fibre, 1,8 g proteine, 0,01 g sale.
833) Zucca Butternut: 45 kcal, 0,1 g grassi, 0,0 g grassi saturi, 11,7 g carboidrati, 2,2 g zuccheri, 2,0 g fibre, 1,0 g proteine, 0,01 g sale.
834) Zucca Delica: 35 kcal, 0,1 g grassi, 0,0 g grassi saturi, 8,5 g carboidrati, 3,0 g zuccheri, 1,5 g fibre, 1,2 g proteine, 0,01 g sale.
835) Peperone Friggitello: 25 kcal, 0,3 g grassi, 0,0 g grassi saturi, 5,0 g carboidrati, 2,8 g zuccheri, 2,0 g fibre, 1,2 g proteine, 0,01 g sale.
836) Insalata Belga Rossa: 17 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 0,7 g zuccheri, 3,1 g fibre, 1,2 g proteine, 0,01 g sale.
837) Lattughino da taglio: 15 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 1,0 g zuccheri, 1,5 g fibre, 1,5 g proteine, 0,02 g sale.
838) Carciofino sott'olio (sgocciolato): 90 kcal, 7,5 g grassi, 1,0 g grassi saturi, 3,5 g carboidrati, 0,5 g zuccheri, 4,5 g fibre, 2,5 g proteine, 0,80 g sale.
839) Pomodori Secchi (non sott'olio): 258 kcal, 3,0 g grassi, 0,4 g grassi saturi, 55,7 g carboidrati, 37,6 g zuccheri, 12,3 g fibre, 14,1 g proteine, 0,25 g sale.
840) Cuore di Palma: 28 kcal, 0,6 g grassi, 0,1 g grassi saturi, 4,6 g carboidrati, 2,0 g zuccheri, 2,4 g fibre, 2,5 g proteine, 0,40 g sale.
841) Wasabi (radice fresca): 109 kcal, 0,6 g grassi, 0,1 g grassi saturi, 23,5 g carboidrati, 7,8 g zuccheri, 7,8 g fibre, 4,8 g proteine, 0,01 g sale.
842) Lichene Islandico: 30 kcal, 0,1 g grassi, 0,0 g grassi saturi, 5,0 g carboidrati, 0,1 g zuccheri, 2,0 g fibre, 1,5 g proteine, 0,05 g sale.
843) Samphire (Asparago di mare): 15 kcal, 0,1 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 0,1 g zuccheri, 1,5 g fibre, 1,2 g proteine, 1,50 g sale.
844) Broccolo Ramoso: 35 kcal, 0,4 g grassi, 0,1 g grassi saturi, 6,5 g carboidrati, 1,5 g zuccheri, 3,0 g fibre, 3,0 g proteine, 0,03 g sale.
845) Foglie di Vite: 93 kcal, 2,1 g grassi, 0,3 g grassi saturi, 17,3 g carboidrati, 6,3 g zuccheri, 11,0 g fibre, 5,6 g proteine, 0,01 g sale.
846) Pomodoro Cuore di Bue: 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,9 g carboidrati, 2,6 g zuccheri, 1,2 g fibre, 0,9 g proteine, 0,01 g sale.
847) Pomodoro San Marzano: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 2,8 g zuccheri, 1,4 g fibre, 1,0 g proteine, 0,01 g sale.
848) Pomodoro Nero di Crimea: 22 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 3,2 g zuccheri, 1,3 g fibre, 1,1 g proteine, 0,01 g sale.
849) Pomodoro Datterino: 24 kcal, 0,2 g grassi, 0,0 g grassi saturi, 5,0 g carboidrati, 4,1 g zuccheri, 1,5 g fibre, 1,1 g proteine, 0,01 g sale.
850) Melanzana Bianca: 24 kcal, 0,2 g grassi, 0,0 g grassi saturi, 5,8 g carboidrati, 3,3 g zuccheri, 3,0 g fibre, 1,1 g proteine, 0,01 g sale.
851) Melanzana Perlina: 26 kcal, 0,3 g grassi, 0,0 g grassi saturi, 6,2 g carboidrati, 3,6 g zuccheri, 3,2 g fibre, 1,2 g proteine, 0,01 g sale.
852) Melanzana Tonda Sfumata Rosa: 25 kcal, 0,2 g grassi, 0,0 g grassi saturi, 5,9 g carboidrati, 3,4 g zuccheri, 3,1 g fibre, 1,0 g proteine, 0,01 g sale.
854) Radice di Prezzemolo: 55 kcal, 0,6 g grassi, 0,1 g grassi saturi, 12,0 g carboidrati, 1,5 g zuccheri, 4,3 g fibre, 2,3 g proteine, 0,01 g sale.
855) Manioca (Yuca): 160 kcal, 0,3 g grassi, 0,1 g grassi saturi, 38,0 g carboidrati, 1,7 g zuccheri, 1,8 g fibre, 1,4 g proteine, 0,01 g sale.
856) Yam (Igname): 118 kcal, 0,2 g grassi, 0,0 g grassi saturi, 27,9 g carboidrati, 0,5 g zuccheri, 4,1 g fibre, 1,5 g proteine, 0,01 g sale.
857) Taro: 112 kcal, 0,2 g grassi, 0,0 g grassi saturi, 26,5 g carboidrati, 0,4 g zuccheri, 4,1 g fibre, 1,5 g proteine, 0,01 g sale.
858) Jicama (Rapa messicana): 38 kcal, 0,1 g grassi, 0,0 g grassi saturi, 8,8 g carboidrati, 1,8 g zuccheri, 4,9 g fibre, 0,7 g proteine, 0,01 g sale.
859) Rutabaga: 37 kcal, 0,2 g grassi, 0,0 g grassi saturi, 8,6 g carboidrati, 4,5 g zuccheri, 2,3 g fibre, 1,1 g proteine, 0,01 g sale.
860) Arracacha: 130 kcal, 0,3 g grassi, 0,1 g grassi saturi, 31,0 g carboidrati, 2,0 g zuccheri, 1,5 g fibre, 1,2 g proteine, 0,01 g sale.
861) Oca (Tubero andino): 60 kcal, 0,1 g grassi, 0,0 g grassi saturi, 13,0 g carboidrati, 4,0 g zuccheri, 1,5 g fibre, 1,1 g proteine, 0,01 g sale.
862) Mashua: 52 kcal, 0,1 g grassi, 0,0 g grassi saturi, 11,5 g carboidrati, 3,5 g zuccheri, 1,2 g fibre, 1,5 g proteine, 0,01 g sale.
863) Ulluco: 50 kcal, 0,1 g grassi, 0,0 g grassi saturi, 11,0 g carboidrati, 2,5 g zuccheri, 1,0 g fibre, 1,3 g proteine, 0,01 g sale.
865) Senape Indiana (foglie): 27 kcal, 0,4 g grassi, 0,0 g grassi saturi, 4,7 g carboidrati, 1,3 g zuccheri, 3,2 g fibre, 2,9 g proteine, 0,02 g sale.
866) Amaranto (foglie): 23 kcal, 0,3 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 0,0 g zuccheri, 2,1 g fibre, 2,5 g proteine, 0,02 g sale.
867) Fico d'India (Cladodi/Nopales): 16 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,3 g carboidrati, 1,1 g zuccheri, 2,2 g fibre, 1,3 g proteine, 0,02 g sale.
868) Malva (foglie): 28 kcal, 0,5 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 1,0 g zuccheri, 2,5 g fibre, 2,0 g proteine, 0,01 g sale.
869) Piantaggine: 35 kcal, 0,4 g grassi, 0,1 g grassi saturi, 6,5 g carboidrati, 1,2 g zuccheri, 2,8 g fibre, 2,5 g proteine, 0,01 g sale.
870) Farinello (Spinacio selvatico): 43 kcal, 0,8 g grassi, 0,1 g grassi saturi, 7,3 g carboidrati, 0,5 g zuccheri, 4,0 g fibre, 4,2 g proteine, 0,01 g sale.
871) Silene (Strigoli): 25 kcal, 0,4 g grassi, 0,1 g grassi saturi, 3,5 g carboidrati, 0,8 g zuccheri, 2,5 g fibre, 2,8 g proteine, 0,01 g sale.
872) Scolymo (Cardo mariano): 22 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 1,0 g zuccheri, 3,5 g fibre, 1,5 g proteine, 0,05 g sale.
873) Luppolo selvatico (Bruscandoli): 35 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 3,5 g proteine, 0,01 g sale.
874) Papavero (foglie giovani): 20 kcal, 0,3 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 0,5 g zuccheri, 2,0 g fibre, 2,0 g proteine, 0,01 g sale.
876) Kohlrabi (Cavolo Rapa) Verde: 27 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,2 g carboidrati, 2,6 g zuccheri, 3,6 g fibre, 1,7 g proteine, 0,02 g sale.
877) Kohlrabi Viola: 28 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,4 g carboidrati, 2,7 g zuccheri, 3,6 g fibre, 1,7 g proteine, 0,02 g sale.
878) Momordica (Amante amaro/Bitter Melon): 17 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,7 g carboidrati, 1,0 g zuccheri, 2,8 g fibre, 1,0 g proteine, 0,01 g sale.
879) Luffa (fresca): 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,3 g carboidrati, 2,0 g zuccheri, 0,5 g fibre, 1,2 g proteine, 0,01 g sale.
880) Chayote (foglie): 19 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,8 g carboidrati, 1,0 g zuccheri, 1,5 g fibre, 4,0 g proteine, 0,01 g sale.
881) Zucchina gialla: 16 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,3 g carboidrati, 2,2 g zuccheri, 1,0 g fibre, 1,2 g proteine, 0,01 g sale.
882) Patisson (Zucca castagna): 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,8 g carboidrati, 2,0 g zuccheri, 1,2 g fibre, 1,2 g proteine, 0,01 g sale.
884) Funghi Shiitake: 34 kcal, 0,5 g grassi, 0,1 g grassi saturi, 6,8 g carboidrati, 2,4 g zuccheri, 2,5 g fibre, 2,2 g proteine, 0,01 g sale.
885) Funghi Cantarelli (Finferli): 32 kcal, 0,5 g grassi, 0,1 g grassi saturi, 6,9 g carboidrati, 1,2 g zuccheri, 3,8 g fibre, 1,5 g proteine, 0,01 g sale.
886) Funghi Enoki: 37 kcal, 0,3 g grassi, 0,0 g grassi saturi, 7,8 g carboidrati, 0,2 g zuccheri, 2,7 g fibre, 2,7 g proteine, 0,01 g sale.
887) Funghi Spugnole (Morchelle): 31 kcal, 0,6 g grassi, 0,1 g grassi saturi, 5,1 g carboidrati, 0,6 g zuccheri, 2,8 g fibre, 3,1 g proteine, 0,01 g sale.
888) Funghi Galletti: 15 kcal, 0,5 g grassi, 0,1 g grassi saturi, 0,6 g carboidrati, 0,5 g zuccheri, 3,2 g fibre, 1,5 g proteine, 0,01 g sale.
889) Funghi Pioppini: 28 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 1,5 g zuccheri, 2,2 g fibre, 2,5 g proteine, 0,01 g sale.
891) Batavia (Insalata): 15 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 1,2 g zuccheri, 1,3 g fibre, 1,3 g proteine, 0,02 g sale.
892) Mizuna: 22 kcal, 0,3 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 1,0 g zuccheri, 2,0 g fibre, 2,0 g proteine, 0,03 g sale.
893) Komatsuna: 14 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,4 g carboidrati, 0,5 g zuccheri, 1,5 g fibre, 1,5 g proteine, 0,05 g sale.
894) Perilla (Shiso): 37 kcal, 0,5 g grassi, 0,1 g grassi saturi, 7,0 g carboidrati, 0,5 g zuccheri, 4,0 g fibre, 2,5 g proteine, 0,01 g sale.
895) Tatsoi: 20 kcal, 0,3 g grassi, 0,0 g grassi saturi, 3,0 g carboidrati, 1,2 g zuccheri, 1,0 g fibre, 2,0 g proteine, 0,04 g sale.
896) Bietola Rossa (foglie): 22 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,3 g carboidrati, 1,1 g zuccheri, 3,7 g fibre, 2,2 g proteine, 0,23 g sale.
897) Minutina (Erba stella): 15 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 0,5 g zuccheri, 2,0 g fibre, 1,5 g proteine, 0,02 g sale.
898) Portulaca di mare: 18 kcal, 0,3 g grassi, 0,0 g grassi saturi, 2,0 g carboidrati, 0,2 g zuccheri, 1,5 g fibre, 1,5 g proteine, 1,20 g sale.
899) Nasturzio (foglie): 30 kcal, 0,5 g grassi, 0,1 g grassi saturi, 5,0 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 2,5 g proteine, 0,01 g sale.
900) Elicriso (foglie): 25 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 1,2 g proteine, 0,01 g sale.
902) Peperoncino Habanero: 45 kcal, 0,5 g grassi, 0,1 g grassi saturi, 9,5 g carboidrati, 5,0 g zuccheri, 1,8 g fibre, 2,0 g proteine, 0,01 g sale.
903) Peperoncino JalapeÃ±o: 29 kcal, 0,4 g grassi, 0,1 g grassi saturi, 6,5 g carboidrati, 4,1 g zuccheri, 2,8 g fibre, 0,9 g proteine, 0,01 g sale.
904) Peperoncino Serrano: 32 kcal, 0,4 g grassi, 0,1 g grassi saturi, 7,0 g carboidrati, 4,5 g zuccheri, 3,7 g fibre, 1,7 g proteine, 0,01 g sale.
905) Peperoncino Thai (Bird's Eye): 40 kcal, 0,4 g grassi, 0,1 g grassi saturi, 9,0 g carboidrati, 5,0 g zuccheri, 1,5 g fibre, 2,0 g proteine, 0,01 g sale.
906) Pimento (Peperone dolce): 26 kcal, 0,2 g grassi, 0,0 g grassi saturi, 6,0 g carboidrati, 4,0 g zuccheri, 2,0 g fibre, 1,0 g proteine, 0,01 g sale.
907) Trinidad Scorpion: 48 kcal, 0,6 g grassi, 0,1 g grassi saturi, 10,0 g carboidrati, 5,5 g zuccheri, 2,0 g fibre, 2,2 g proteine, 0,01 g sale.
908) Carolina Reaper: 50 kcal, 0,7 g grassi, 0,1 g grassi saturi, 10,5 g carboidrati, 6,0 g zuccheri, 2,0 g fibre, 2,3 g proteine, 0,01 g sale.
910) Acetosa: 22 kcal, 0,7 g grassi, 0,1 g grassi saturi, 3,2 g carboidrati, 0,5 g zuccheri, 2,9 g fibre, 2,0 g proteine, 0,01 g sale.
911) Agretto di scoglio: 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,0 g carboidrati, 1,0 g zuccheri, 2,0 g fibre, 1,6 g proteine, 0,80 g sale.
912) Amaranto selvatico (Gallega): 25 kcal, 0,3 g grassi, 0,1 g grassi saturi, 4,2 g carboidrati, 0,0 g zuccheri, 2,5 g fibre, 2,8 g proteine, 0,02 g sale.
913) Asfodelo (germogli): 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 1,0 g zuccheri, 2,0 g fibre, 1,5 g proteine, 0,01 g sale.
914) Balsamina (foglie): 19 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,8 g carboidrati, 1,0 g zuccheri, 2,8 g fibre, 1,2 g proteine, 0,01 g sale.
915) Barbarea (Erba di Santa Barbara): 32 kcal, 0,4 g grassi, 0,1 g grassi saturi, 5,5 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 2,5 g proteine, 0,01 g sale.
916) Bieta Svizzera: 19 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,7 g carboidrati, 1,1 g zuccheri, 1,6 g fibre, 1,8 g proteine, 0,21 g sale.
917) Borsa del Pastore: 33 kcal, 0,5 g grassi, 0,1 g grassi saturi, 5,0 g carboidrati, 0,5 g zuccheri, 3,0 g fibre, 3,0 g proteine, 0,01 g sale.
918) Caccialepre: 22 kcal, 0,3 g grassi, 0,0 g grassi saturi, 3,8 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 1,8 g proteine, 0,01 g sale.
919) Cardamine: 30 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 1,0 g zuccheri, 2,0 g fibre, 2,5 g proteine, 0,01 g sale.
920) Cardoncelli (Funghi): 38 kcal, 0,4 g grassi, 0,1 g grassi saturi, 5,5 g carboidrati, 1,2 g zuccheri, 3,5 g fibre, 3,8 g proteine, 0,01 g sale.
921) Carota Nera: 35 kcal, 0,2 g grassi, 0,0 g grassi saturi, 8,2 g carboidrati, 4,0 g zuccheri, 3,0 g fibre, 1,0 g proteine, 0,05 g sale.
922) Carota Viola: 38 kcal, 0,2 g grassi, 0,0 g grassi saturi, 9,0 g carboidrati, 4,5 g zuccheri, 2,8 g fibre, 0,9 g proteine, 0,06 g sale.
923) Cavolo Abissino: 30 kcal, 0,4 g grassi, 0,1 g grassi saturi, 5,8 g carboidrati, 1,5 g zuccheri, 3,0 g fibre, 3,0 g proteine, 0,03 g sale.
924) Cavolo di Pechino (Napa): 16 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,2 g carboidrati, 1,5 g zuccheri, 1,2 g fibre, 1,2 g proteine, 0,02 g sale.
925) Centocchio (Stellaria): 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,0 g carboidrati, 0,5 g zuccheri, 1,5 g fibre, 1,5 g proteine, 0,01 g sale.
926) Cerfoglio: 50 kcal, 0,6 g grassi, 0,1 g grassi saturi, 10,0 g carboidrati, 1,0 g zuccheri, 3,0 g fibre, 3,5 g proteine, 0,08 g sale.
927) Chenopodio (Buon Enrico): 32 kcal, 0,6 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 0,5 g zuccheri, 3,5 g fibre, 3,5 g proteine, 0,01 g sale.
928) Chrysanthemum coronarium (foglie commestibili): 24 kcal, 0,3 g grassi, 0,0 g grassi saturi, 4,3 g carboidrati, 1,0 g zuccheri, 3,0 g fibre, 2,3 g proteine, 0,04 g sale.
929) Cicerchia (fresca): 95 kcal, 0,8 g grassi, 0,1 g grassi saturi, 15,0 g carboidrati, 2,5 g zuccheri, 6,0 g fibre, 8,5 g proteine, 0,01 g sale.
930) Cicoria di Bruxelles: 17 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 0,7 g zuccheri, 3,1 g fibre, 1,2 g proteine, 0,01 g sale.
931) Cicoria Witloof: 16 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 0,5 g zuccheri, 3,0 g fibre, 1,2 g proteine, 0,01 g sale.
932) Crespigno: 28 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 1,0 g zuccheri, 3,2 g fibre, 2,4 g proteine, 0,01 g sale.
933) Dente di Leone (fiori): 45 kcal, 0,7 g grassi, 0,2 g grassi saturi, 9,2 g carboidrati, 0,7 g zuccheri, 3,5 g fibre, 2,7 g proteine, 0,07 g sale.
934) Dolcetta: 21 kcal, 0,4 g grassi, 0,1 g grassi saturi, 3,6 g carboidrati, 1,2 g zuccheri, 1,5 g fibre, 2,0 g proteine, 0,01 g sale.
935) Enula Campana (radice): 40 kcal, 0,3 g grassi, 0,0 g grassi saturi, 9,5 g carboidrati, 1,0 g zuccheri, 4,0 g fibre, 1,2 g proteine, 0,01 g sale.
936) Erba Cipollina: 30 kcal, 0,7 g grassi, 0,1 g grassi saturi, 4,4 g carboidrati, 1,9 g zuccheri, 2,5 g fibre, 3,3 g proteine, 0,01 g sale.
937) Erba Medica (foglie): 23 kcal, 0,3 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 4,0 g proteine, 0,01 g sale.
938) Farfaraccio: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 1,0 g zuccheri, 2,5 g fibre, 1,5 g proteine, 0,01 g sale.
939) Fiori di Zucca: 15 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,3 g carboidrati, 1,5 g zuccheri, 0,5 g fibre, 1,2 g proteine, 0,01 g sale.
940) Foglie di Amaranto: 23 kcal, 0,3 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 1,2 g zuccheri, 2,1 g fibre, 2,5 g proteine, 0,02 g sale.
941) Foglie di Barbabietola: 22 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,3 g carboidrati, 1,1 g zuccheri, 3,7 g fibre, 2,2 g proteine, 0,22 g sale.
942) Foglie di Coriandolo: 23 kcal, 0,5 g grassi, 0,0 g grassi saturi, 3,7 g carboidrati, 0,9 g zuccheri, 2,8 g fibre, 2,1 g proteine, 0,05 g sale.
943) Foglie di Rafano: 32 kcal, 0,4 g grassi, 0,1 g grassi saturi, 6,0 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 2,5 g proteine, 0,01 g sale.
944) Foglie di Senape: 27 kcal, 0,4 g grassi, 0,0 g grassi saturi, 4,7 g carboidrati, 1,3 g zuccheri, 3,2 g fibre, 2,9 g proteine, 0,02 g sale.
945) Friggitelli Rossi: 31 kcal, 0,3 g grassi, 0,0 g grassi saturi, 6,0 g carboidrati, 4,2 g zuccheri, 2,1 g fibre, 1,1 g proteine, 0,01 g sale.
946) Funghi Maitake: 31 kcal, 0,2 g grassi, 0,0 g grassi saturi, 7,0 g carboidrati, 2,1 g zuccheri, 2,7 g fibre, 1,9 g proteine, 0,01 g sale.
947) Funghi Orecchioni: 33 kcal, 0,4 g grassi, 0,1 g grassi saturi, 6,0 g carboidrati, 1,1 g zuccheri, 2,3 g fibre, 3,3 g proteine, 0,01 g sale.
948) Funghi Shimeji: 35 kcal, 0,4 g grassi, 0,1 g grassi saturi, 7,0 g carboidrati, 1,0 g zuccheri, 3,0 g fibre, 2,5 g proteine, 0,01 g sale.
949) Grespino: 30 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,8 g carboidrati, 1,0 g zuccheri, 3,5 g fibre, 2,5 g proteine, 0,01 g sale.
950) Indivia Ricciuta: 17 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,4 g carboidrati, 0,3 g zuccheri, 3,1 g fibre, 1,2 g proteine, 0,03 g sale.
951) Kailan (Broccolo Cinese): 30 kcal, 0,7 g grassi, 0,1 g grassi saturi, 4,6 g carboidrati, 0,8 g zuccheri, 2,5 g fibre, 1,1 g proteine, 0,03 g sale.
952) Laminaria (Alga Kombu fresca): 43 kcal, 0,6 g grassi, 0,1 g grassi saturi, 9,5 g carboidrati, 0,5 g zuccheri, 1,3 g fibre, 1,7 g proteine, 2,30 g sale.
953) Lapsana (Erba dei capezzoli): 25 kcal, 0,3 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 2,2 g proteine, 0,01 g sale.
954) Lattuga Asparago (Celtuce): 18 kcal, 0,3 g grassi, 0,1 g grassi saturi, 3,3 g carboidrati, 1,3 g zuccheri, 1,7 g fibre, 0,9 g proteine, 0,01 g sale.
955) Lichene Mannaro: 35 kcal, 0,2 g grassi, 0,0 g grassi saturi, 7,0 g carboidrati, 0,1 g zuccheri, 4,0 g fibre, 2,0 g proteine, 0,05 g sale.
956) Luffa Cilindrica: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,3 g carboidrati, 2,0 g zuccheri, 0,5 g fibre, 1,2 g proteine, 0,01 g sale.
957) Lupino fresco (ammollato): 119 kcal, 2,9 g grassi, 0,4 g grassi saturi, 9,9 g carboidrati, 0,5 g zuccheri, 4,8 g fibre, 15,6 g proteine, 0,01 g sale.
958) Mizuna Viola: 23 kcal, 0,3 g grassi, 0,0 g grassi saturi, 3,6 g carboidrati, 1,0 g zuccheri, 2,0 g fibre, 2,0 g proteine, 0,03 g sale.
959) Ononide: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 1,0 g zuccheri, 3,0 g fibre, 1,2 g proteine, 0,01 g sale.
960) Ortica Bianca: 40 kcal, 0,1 g grassi, 0,0 g grassi saturi, 7,0 g carboidrati, 0,1 g zuccheri, 6,5 g fibre, 2,5 g proteine, 0,01 g sale.
961) Palmito: 28 kcal, 0,6 g grassi, 0,1 g grassi saturi, 4,6 g carboidrati, 2,0 g zuccheri, 2,4 g fibre, 2,5 g proteine, 0,43 g sale.
962) Panicaut (Calcatreppola): 35 kcal, 0,4 g grassi, 0,1 g grassi saturi, 6,0 g carboidrati, 1,0 g zuccheri, 3,0 g fibre, 2,0 g proteine, 0,01 g sale.
963) Pastinaca Selvatica: 75 kcal, 0,3 g grassi, 0,1 g grassi saturi, 18,0 g carboidrati, 4,8 g zuccheri, 4,9 g fibre, 1,2 g proteine, 0,01 g sale.
964) Pimpinella: 28 kcal, 0,5 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 1,0 g zuccheri, 2,0 g fibre, 2,5 g proteine, 0,01 g sale.
965) Pirolino: 25 kcal, 0,3 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 1,0 g zuccheri, 2,0 g fibre, 1,8 g proteine, 0,01 g sale.
966) Pomodoro Giallo: 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,9 g carboidrati, 2,6 g zuccheri, 1,2 g fibre, 0,9 g proteine, 0,01 g sale.
967) Porro Selvatico: 60 kcal, 0,3 g grassi, 0,0 g grassi saturi, 14,0 g carboidrati, 3,5 g zuccheri, 2,0 g fibre, 1,5 g proteine, 0,01 g sale.
968) Prezzemolo (foglie): 36 kcal, 0,8 g grassi, 0,1 g grassi saturi, 6,3 g carboidrati, 0,9 g zuccheri, 3,3 g fibre, 3,0 g proteine, 0,06 g sale.
969) Quinoa (foglie): 23 kcal, 0,3 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 3,0 g proteine, 0,02 g sale.
970) Radicchio di Gorizia: 23 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 0,5 g zuccheri, 3,0 g fibre, 1,4 g proteine, 0,01 g sale.
971) Radicchio di Lusia: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 0,5 g zuccheri, 2,8 g fibre, 1,2 g proteine, 0,01 g sale.
972) Radice di Bardana: 72 kcal, 0,2 g grassi, 0,0 g grassi saturi, 17,3 g carboidrati, 2,9 g zuccheri, 3,3 g fibre, 1,5 g proteine, 0,01 g sale.
973) Radice di Cicoria: 72 kcal, 0,2 g grassi, 0,0 g grassi saturi, 17,5 g carboidrati, 8,7 g zuccheri, 2,0 g fibre, 1,4 g proteine, 0,05 g sale.
974) Raperonzolo (radice): 40 kcal, 0,1 g grassi, 0,0 g grassi saturi, 9,0 g carboidrati, 3,0 g zuccheri, 2,5 g fibre, 1,0 g proteine, 0,01 g sale.
975) Raperonzolo (foglie): 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 1,0 g zuccheri, 1,5 g fibre, 1,5 g proteine, 0,01 g sale.
976) Rapini: 22 kcal, 0,5 g grassi, 0,1 g grassi saturi, 3,1 g carboidrati, 0,4 g zuccheri, 2,7 g fibre, 3,2 g proteine, 0,03 g sale.
977) Ravanello Lungo: 16 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,4 g carboidrati, 1,9 g zuccheri, 1,6 g fibre, 0,7 g proteine, 0,04 g sale.
978) Ravanello Nero: 18 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 2,0 g zuccheri, 2,0 g fibre, 0,8 g proteine, 0,04 g sale.
979) Romice: 22 kcal, 0,7 g grassi, 0,1 g grassi saturi, 3,2 g carboidrati, 0,5 g zuccheri, 2,9 g fibre, 2,0 g proteine, 0,01 g sale.
980) Salsifis (Orecchia di lepre): 82 kcal, 0,2 g grassi, 0,0 g grassi saturi, 18,6 g carboidrati, 1,0 g zuccheri, 3,3 g fibre, 3,3 g proteine, 0,02 g sale.
981) Sanicula: 25 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 1,0 g zuccheri, 2,5 g fibre, 2,0 g proteine, 0,01 g sale.
982) Saponaria: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 0,5 g zuccheri, 2,0 g fibre, 1,5 g proteine, 0,01 g sale.
983) Scolymo Ispanico: 22 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 1,0 g zuccheri, 3,5 g fibre, 1,5 g proteine, 0,05 g sale.
984) Scorzonera Bianca: 82 kcal, 0,2 g grassi, 0,0 g grassi saturi, 18,6 g carboidrati, 1,0 g zuccheri, 3,3 g fibre, 3,3 g proteine, 0,02 g sale.
985) Sedano d'acqua: 14 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 1,0 g zuccheri, 1,2 g fibre, 0,8 g proteine, 0,15 g sale.
986) Senape Nera (foglie): 27 kcal, 0,4 g grassi, 0,0 g grassi saturi, 4,7 g carboidrati, 1,3 g zuccheri, 3,2 g fibre, 2,9 g proteine, 0,02 g sale.
987) Silene Vulgaris (Carletti): 25 kcal, 0,4 g grassi, 0,1 g grassi saturi, 3,5 g carboidrati, 0,8 g zuccheri, 2,5 g fibre, 2,8 g proteine, 0,01 g sale.
988) Spinacio d'acqua (Kangkong): 19 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,1 g carboidrati, 0,5 g zuccheri, 2,1 g fibre, 2,6 g proteine, 0,11 g sale.
989) Spinacio della Nuova Zelanda: 14 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 0,5 g zuccheri, 0,6 g fibre, 1,5 g proteine, 0,13 g sale.
990) Spinacio Gigante: 23 kcal, 0,4 g grassi, 0,1 g grassi saturi, 3,6 g carboidrati, 0,4 g zuccheri, 2,2 g fibre, 2,9 g proteine, 0,08 g sale.
991) Talegua: 30 kcal, 0,3 g grassi, 0,0 g grassi saturi, 5,5 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 2,0 g proteine, 0,01 g sale.
992) Tamarindo (foglie): 35 kcal, 0,5 g grassi, 0,1 g grassi saturi, 7,0 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 2,5 g proteine, 0,01 g sale.
993) Tarassaco Rosso: 45 kcal, 0,7 g grassi, 0,2 g grassi saturi, 9,2 g carboidrati, 0,7 g zuccheri, 3,5 g fibre, 2,7 g proteine, 0,07 g sale.
994) Tuberina (Crosne): 75 kcal, 0,1 g grassi, 0,0 g grassi saturi, 17,0 g carboidrati, 2,0 g zuccheri, 1,5 g fibre, 2,5 g proteine, 0,01 g sale.
995) Verza di Piacenza: 27 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,0 g carboidrati, 3,2 g zuccheri, 2,5 g fibre, 2,0 g proteine, 0,02 g sale.
996) Viperina: 25 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 1,0 g zuccheri, 2,5 g fibre, 1,8 g proteine, 0,01 g sale.
997) Zucca MusquÃ©e de Provence: 26 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,5 g carboidrati, 2,8 g zuccheri, 0,5 g fibre, 1,0 g proteine, 0,01 g sale.
998) Zucchina con fiore: 16 kcal, 0,3 g grassi, 0,1 g grassi saturi, 3,1 g carboidrati, 2,5 g zuccheri, 1,1 g fibre, 1,2 g proteine, 0,02 g sale.
1000) Germogli di Alfalfa (Erba medica): 23 kcal, 0,7 g grassi, 0,1 g grassi saturi, 2,1 g carboidrati, 0,2 g zuccheri, 1,9 g fibre, 4,0 g proteine, 0,01 g sale.
1001) Germogli di Broccoli: 35 kcal, 0,5 g grassi, 0,1 g grassi saturi, 5,0 g carboidrati, 1,5 g zuccheri, 2,5 g fibre, 3,5 g proteine, 0,02 g sale.
1002) Germogli di Crescione: 32 kcal, 0,7 g grassi, 0,1 g grassi saturi, 5,5 g carboidrati, 0,5 g zuccheri, 1,1 g fibre, 2,6 g proteine, 0,01 g sale.
1003) Germogli di Daikon: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 1,5 g zuccheri, 1,0 g fibre, 2,0 g proteine, 0,02 g sale.
1004) Germogli di Fagiolo Mungo (Soy sprouts): 30 kcal, 0,2 g grassi, 0,0 g grassi saturi, 5,9 g carboidrati, 4,1 g zuccheri, 1,8 g fibre, 3,0 g proteine, 0,01 g sale.
1005) Germogli di Fenugreco: 33 kcal, 0,6 g grassi, 0,1 g grassi saturi, 5,5 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 4,5 g proteine, 0,01 g sale.
1006) Germogli di Frumento: 198 kcal, 1,3 g grassi, 0,2 g grassi saturi, 42,5 g carboidrati, 0,0 g zuccheri, 1,1 g fibre, 7,5 g proteine, 0,01 g sale.
1007) Germogli di Girasole: 45 kcal, 2,5 g grassi, 0,3 g grassi saturi, 4,0 g carboidrati, 0,5 g zuccheri, 2,0 g fibre, 3,5 g proteine, 0,01 g sale.
1008) Germogli di Lenticchie: 106 kcal, 0,5 g grassi, 0,1 g grassi saturi, 22,1 g carboidrati, 2,0 g zuccheri, 1,5 g fibre, 9,0 g proteine, 0,01 g sale.
1009) Germogli di Piselli: 124 kcal, 0,7 g grassi, 0,1 g grassi saturi, 25,0 g carboidrati, 4,5 g zuccheri, 3,0 g fibre, 8,8 g proteine, 0,01 g sale.
1010) Germogli di Porro: 35 kcal, 0,3 g grassi, 0,0 g grassi saturi, 7,5 g carboidrati, 2,0 g zuccheri, 1,5 g fibre, 2,5 g proteine, 0,01 g sale.
1011) Germogli di Radis: 43 kcal, 0,3 g grassi, 0,1 g grassi saturi, 3,6 g carboidrati, 1,9 g zuccheri, 2,5 g fibre, 3,8 g proteine, 0,01 g sale.
1012) Germogli di Rapa: 28 kcal, 0,3 g grassi, 0,1 g grassi saturi, 5,5 g carboidrati, 2,5 g zuccheri, 2,0 g fibre, 3,0 g proteine, 0,02 g sale.
1013) Germogli di Rucola: 25 kcal, 0,7 g grassi, 0,1 g grassi saturi, 3,7 g carboidrati, 2,0 g zuccheri, 1,6 g fibre, 2,6 g proteine, 0,03 g sale.
1014) Germogli di Senape: 27 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,7 g carboidrati, 1,3 g zuccheri, 3,2 g fibre, 2,9 g proteine, 0,02 g sale.
1015) Germogli di Trifoglio: 23 kcal, 0,7 g grassi, 0,1 g grassi saturi, 2,1 g carboidrati, 0,2 g zuccheri, 1,9 g fibre, 4,0 g proteine, 0,01 g sale.
1016) Micro-bietola: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 1,5 g zuccheri, 1,5 g fibre, 2,0 g proteine, 0,20 g sale.
1017) Micro-cavolo nero: 45 kcal, 0,8 g grassi, 0,1 g grassi saturi, 8,0 g carboidrati, 2,0 g zuccheri, 3,0 g fibre, 4,0 g proteine, 0,04 g sale.
1018) Micro-cilantro: 23 kcal, 0,5 g grassi, 0,0 g grassi saturi, 3,7 g carboidrati, 0,9 g zuccheri, 2,8 g fibre, 2,1 g proteine, 0,05 g sale.
1019) Micro-prezzemolo: 36 kcal, 0,8 g grassi, 0,1 g grassi saturi, 6,3 g carboidrati, 0,9 g zuccheri, 3,3 g fibre, 3,0 g proteine, 0,06 g sale.
1021) Ceci freschi (verdi): 164 kcal, 2,6 g grassi, 0,3 g grassi saturi, 27,4 g carboidrati, 4,8 g zuccheri, 7,6 g fibre, 8,9 g proteine, 0,01 g sale.
1022) Lenticchie fresche: 116 kcal, 0,4 g grassi, 0,1 g grassi saturi, 20,1 g carboidrati, 1,8 g zuccheri, 7,9 g fibre, 9,0 g proteine, 0,01 g sale.
1023) Fagioli Borlotti freschi: 142 kcal, 0,8 g grassi, 0,2 g grassi saturi, 23,2 g carboidrati, 1,5 g zuccheri, 7,0 g fibre, 10,2 g proteine, 0,01 g sale.
1024) Fagioli Cannellini freschi: 138 kcal, 0,6 g grassi, 0,1 g grassi saturi, 22,5 g carboidrati, 1,2 g zuccheri, 6,5 g fibre, 9,5 g proteine, 0,01 g sale.
1025) Fagioli di Lima freschi: 113 kcal, 0,4 g grassi, 0,1 g grassi saturi, 20,2 g carboidrati, 1,5 g zuccheri, 4,9 g fibre, 6,8 g proteine, 0,01 g sale.
1026) Fagioli Mungo freschi: 105 kcal, 0,4 g grassi, 0,1 g grassi saturi, 19,2 g carboidrati, 2,0 g zuccheri, 7,6 g fibre, 7,0 g proteine, 0,01 g sale.
1027) Fagioli Neri freschi: 132 kcal, 0,5 g grassi, 0,1 g grassi saturi, 23,7 g carboidrati, 1,0 g zuccheri, 8,7 g fibre, 8,9 g proteine, 0,01 g sale.
1028) Fagioli Rossi freschi: 127 kcal, 0,5 g grassi, 0,1 g grassi saturi, 22,8 g carboidrati, 1,1 g zuccheri, 7,4 g fibre, 8,7 g proteine, 0,01 g sale.
1029) Fagioli Azuki freschi: 128 kcal, 0,5 g grassi, 0,1 g grassi saturi, 24,0 g carboidrati, 2,0 g zuccheri, 7,0 g fibre, 7,5 g proteine, 0,01 g sale.
1030) Fagioli dall'occhio freschi: 118 kcal, 0,5 g grassi, 0,1 g grassi saturi, 21,0 g carboidrati, 2,5 g zuccheri, 6,5 g fibre, 8,0 g proteine, 0,01 g sale.
1031) Soia Edamame (fresca nel baccello): 122 kcal, 5,2 g grassi, 0,6 g grassi saturi, 10,5 g carboidrati, 2,2 g zuccheri, 5,2 g fibre, 11,0 g proteine, 0,01 g sale.
1032) Lupini freschi (in salamoia): 116 kcal, 2,5 g grassi, 0,3 g grassi saturi, 9,5 g carboidrati, 0,5 g zuccheri, 4,5 g fibre, 14,0 g proteine, 2,50 g sale.
1033) Cicerchie (secche ammollate): 130 kcal, 1,2 g grassi, 0,2 g grassi saturi, 20,0 g carboidrati, 1,5 g zuccheri, 8,0 g fibre, 11,0 g proteine, 0,01 g sale.
1034) Piselli Proteici: 85 kcal, 0,5 g grassi, 0,1 g grassi saturi, 15,0 g carboidrati, 5,5 g zuccheri, 5,5 g fibre, 6,5 g proteine, 0,01 g sale.
1035) Fave fresche piccole: 88 kcal, 0,7 g grassi, 0,1 g grassi saturi, 17,6 g carboidrati, 4,9 g zuccheri, 7,5 g fibre, 8,0 g proteine, 0,01 g sale.
1037) Agriao (Crescione brasiliano): 11 kcal, 0,1 g grassi, 0,0 g grassi saturi, 1,3 g carboidrati, 0,2 g zuccheri, 0,5 g fibre, 2,3 g proteine, 0,04 g sale.
1038) Alga Arame (reidratata): 25 kcal, 0,2 g grassi, 0,0 g grassi saturi, 5,0 g carboidrati, 0,1 g zuccheri, 2,0 g fibre, 1,2 g proteine, 1,10 g sale.
1039) Alga Hijiki (reidratata): 30 kcal, 0,3 g grassi, 0,1 g grassi saturi, 6,0 g carboidrati, 0,1 g zuccheri, 2,5 g fibre, 1,5 g proteine, 1,20 g sale.
1040) Alga Spirulina (fresca): 26 kcal, 0,4 g grassi, 0,1 g grassi saturi, 2,4 g carboidrati, 0,3 g zuccheri, 0,5 g fibre, 5,9 g proteine, 0,10 g sale.
1041) Arakacha (Radice): 130 kcal, 0,3 g grassi, 0,1 g grassi saturi, 31,0 g carboidrati, 2,0 g zuccheri, 1,5 g fibre, 1,2 g proteine, 0,01 g sale.
1042) BambÃ¹ (germogli in scatola): 19 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 1,7 g proteine, 0,25 g sale.
1043) Banana da cottura (Platano verde): 122 kcal, 0,4 g grassi, 0,1 g grassi saturi, 31,9 g carboidrati, 15,0 g zuccheri, 2,3 g fibre, 1,3 g proteine, 0,01 g sale.
1044) Basella (Spinacio di Malabar): 19 kcal, 0,3 g grassi, 0,1 g grassi saturi, 3,4 g carboidrati, 0,5 g zuccheri, 1,5 g fibre, 1,8 g proteine, 0,02 g sale.
1045) Bietola Cinese: 13 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,2 g carboidrati, 1,2 g zuccheri, 1,0 g fibre, 1,5 g proteine, 0,06 g sale.
1046) Calabash (Zucca a fiasco): 14 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,4 g carboidrati, 1,5 g zuccheri, 0,5 g fibre, 0,6 g proteine, 0,01 g sale.
1047) Cardo Gobbo: 17 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 1,5 g zuccheri, 1,6 g fibre, 0,7 g proteine, 0,17 g sale.
1048) Carosello (Cetriolo-pugliese): 15 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 1,8 g zuccheri, 0,8 g fibre, 0,7 g proteine, 0,01 g sale.
1049) Cassava (foglie): 37 kcal, 0,5 g grassi, 0,1 g grassi saturi, 7,0 g carboidrati, 1,0 g zuccheri, 2,5 g fibre, 3,7 g proteine, 0,01 g sale.
1050) Chayote (Sechium edule): 19 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 1,7 g zuccheri, 1,7 g fibre, 0,8 g proteine, 0,01 g sale.
1051) Cipolla di Tropea: 37 kcal, 0,1 g grassi, 0,0 g grassi saturi, 8,2 g carboidrati, 4,5 g zuccheri, 1,5 g fibre, 1,0 g proteine, 0,01 g sale.
1052) Cipolla Egiziana (Bulbilli): 45 kcal, 0,1 g grassi, 0,0 g grassi saturi, 10,0 g carboidrati, 5,0 g zuccheri, 2,0 g fibre, 1,5 g proteine, 0,01 g sale.
1053) Daikon Rosso: 18 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,1 g carboidrati, 2,5 g zuccheri, 1,6 g fibre, 0,6 g proteine, 0,02 g sale.
1054) Durian (usato come verdura acerba): 147 kcal, 5,3 g grassi, 1,0 g grassi saturi, 27,1 g carboidrati, 10,0 g zuccheri, 3,8 g fibre, 1,5 g proteine, 0,01 g sale.
1055) Fagiolo serpente (Yardlong bean): 47 kcal, 0,4 g grassi, 0,1 g grassi saturi, 8,4 g carboidrati, 1,5 g zuccheri, 3,5 g fibre, 2,8 g proteine, 0,01 g sale.
1056) Fiori di Banana: 51 kcal, 0,6 g grassi, 0,1 g grassi saturi, 9,9 g carboidrati, 1,1 g zuccheri, 5,7 g fibre, 1,6 g proteine, 0,01 g sale.
1057) Gai Lan (Broccolo cinese): 30 kcal, 0,7 g grassi, 0,1 g grassi saturi, 4,6 g carboidrati, 0,8 g zuccheri, 2,5 g fibre, 1,1 g proteine, 0,03 g sale.
1058) Galanga (radice fresca): 71 kcal, 1,0 g grassi, 0,2 g grassi saturi, 15,0 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 1,2 g proteine, 0,01 g sale.
1059) Jicama (Radice): 38 kcal, 0,1 g grassi, 0,0 g grassi saturi, 8,8 g carboidrati, 1,8 g zuccheri, 4,9 g fibre, 0,7 g proteine, 0,01 g sale.
1060) Karela (Bitter Melon): 17 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,7 g carboidrati, 1,0 g zuccheri, 2,8 g fibre, 1,0 g proteine, 0,01 g sale.
1061) Kimchi (Verdura fermentata): 15 kcal, 0,5 g grassi, 0,1 g grassi saturi, 2,4 g carboidrati, 1,1 g zuccheri, 1,6 g fibre, 1,1 g proteine, 1,20 g sale.
1062) Luffa acutangula: 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,3 g carboidrati, 2,0 g zuccheri, 0,5 g fibre, 1,2 g proteine, 0,01 g sale.
1063) Malanga: 142 kcal, 0,4 g grassi, 0,1 g grassi saturi, 34,0 g carboidrati, 0,5 g zuccheri, 5,1 g fibre, 1,5 g proteine, 0,01 g sale.
1064) Manioca (radice cruda): 160 kcal, 0,3 g grassi, 0,1 g grassi saturi, 38,1 g carboidrati, 1,7 g zuccheri, 1,8 g fibre, 1,4 g proteine, 0,01 g sale.
1065) Mizuna Verde: 22 kcal, 0,3 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 1,0 g zuccheri, 2,0 g fibre, 2,0 g proteine, 0,03 g sale.
1066) Morella (foglie): 28 kcal, 0,5 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 0,5 g zuccheri, 2,0 g fibre, 2,5 g proteine, 0,01 g sale.
1067) Moringa (foglie): 64 kcal, 1,4 g grassi, 0,4 g grassi saturi, 8,3 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 9,4 g proteine, 0,01 g sale.
1068) Moringa (baccelli/Drumsticks): 37 kcal, 0,2 g grassi, 0,0 g grassi saturi, 8,5 g carboidrati, 3,2 g zuccheri, 3,2 g fibre, 2,1 g proteine, 0,01 g sale.
1069) Nappa Cabbage: 16 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,2 g carboidrati, 1,5 g zuccheri, 1,2 g fibre, 1,2 g proteine, 0,02 g sale.
1070) Nelumbo nucifera (Radice di loto): 74 kcal, 0,1 g grassi, 0,0 g grassi saturi, 17,2 g carboidrati, 0,5 g zuccheri, 4,9 g fibre, 2,6 g proteine, 0,04 g sale.
1071) Okra Rossa: 33 kcal, 0,2 g grassi, 0,0 g grassi saturi, 7,5 g carboidrati, 1,5 g zuccheri, 3,2 g fibre, 1,9 g proteine, 0,01 g sale.
1072) Pak Choi Piccolo (Baby Pak Choi): 13 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,2 g carboidrati, 1,2 g zuccheri, 1,0 g fibre, 1,5 g proteine, 0,06 g sale.
1073) Papaya verde (usata come verdura): 43 kcal, 0,3 g grassi, 0,1 g grassi saturi, 10,8 g carboidrati, 7,8 g zuccheri, 1,7 g fibre, 0,5 g proteine, 0,01 g sale.
1074) Patata Blu (Vitelotte): 75 kcal, 0,1 g grassi, 0,0 g grassi saturi, 17,0 g carboidrati, 1,0 g zuccheri, 2,5 g fibre, 2,0 g proteine, 0,01 g sale.
1075) Patata Ratte: 78 kcal, 0,1 g grassi, 0,0 g grassi saturi, 17,8 g carboidrati, 0,8 g zuccheri, 2,0 g fibre, 2,0 g proteine, 0,01 g sale.
1076) Patisson Giallo: 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,8 g carboidrati, 2,0 g zuccheri, 1,2 g fibre, 1,2 g proteine, 0,01 g sale.
1077) Peperoncino Shishito: 25 kcal, 0,2 g grassi, 0,0 g grassi saturi, 5,0 g carboidrati, 2,5 g zuccheri, 2,0 g fibre, 1,0 g proteine, 0,01 g sale.
1078) Pomodoro Camone: 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,9 g carboidrati, 2,6 g zuccheri, 1,2 g fibre, 0,9 g proteine, 0,01 g sale.
1079) Pomodoro Piennolo: 22 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 3,5 g zuccheri, 1,5 g fibre, 1,0 g proteine, 0,01 g sale.
1080) Radice di Manioca: 160 kcal, 0,3 g grassi, 0,1 g grassi saturi, 38,0 g carboidrati, 1,7 g zuccheri, 1,8 g fibre, 1,4 g proteine, 0,01 g sale.
1081) Radice di Wasabi: 109 kcal, 0,6 g grassi, 0,1 g grassi saturi, 23,5 g carboidrati, 7,8 g zuccheri, 7,8 g fibre, 4,8 g proteine, 0,01 g sale.
1082) Salicornia (Asparago di mare): 15 kcal, 0,1 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 0,1 g zuccheri, 1,5 g fibre, 1,2 g proteine, 1,50 g sale.
1083) Salsifis Nero: 82 kcal, 0,2 g grassi, 0,0 g grassi saturi, 18,6 g carboidrati, 1,0 g zuccheri, 3,3 g fibre, 3,3 g proteine, 0,02 g sale.
1084) Sechium edule (Chayote): 19 kcal, 0,1 g grassi, 0,0 g grassi saturi, 4,5 g carboidrati, 1,7 g zuccheri, 1,7 g fibre, 0,8 g proteine, 0,01 g sale.
1085) Shiso (Perilla): 37 kcal, 0,5 g grassi, 0,1 g grassi saturi, 7,0 g carboidrati, 0,5 g zuccheri, 4,0 g fibre, 2,5 g proteine, 0,01 g sale.
1086) Soca (foglie commestibili): 25 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,0 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 2,0 g proteine, 0,01 g sale.
1087) Soya verde (Edamame): 122 kcal, 5,2 g grassi, 0,6 g grassi saturi, 10,5 g carboidrati, 2,2 g zuccheri, 5,2 g fibre, 11,0 g proteine, 0,01 g sale.
1088) Tatsoi (foglie): 20 kcal, 0,3 g grassi, 0,0 g grassi saturi, 3,0 g carboidrati, 1,2 g zuccheri, 1,0 g fibre, 2,0 g proteine, 0,04 g sale.
1089) Taro (radice): 112 kcal, 0,2 g grassi, 0,0 g grassi saturi, 26,5 g carboidrati, 0,4 g zuccheri, 4,1 g fibre, 1,5 g proteine, 0,01 g sale.
1090) Topinambur Bianco: 73 kcal, 0,0 g grassi, 0,0 g grassi saturi, 17,4 g carboidrati, 9,6 g zuccheri, 1,6 g fibre, 2,0 g proteine, 0,01 g sale.
1091) Topinambur Rosso: 75 kcal, 0,0 g grassi, 0,0 g grassi saturi, 17,6 g carboidrati, 9,8 g zuccheri, 1,6 g fibre, 2,0 g proteine, 0,01 g sale.
1092) Truffle Bianco (Alba): 35 kcal, 0,8 g grassi, 0,1 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 8,5 g fibre, 6,5 g proteine, 0,05 g sale.
1093) Truffle Estivo (Scorzone): 30 kcal, 0,6 g grassi, 0,1 g grassi saturi, 0,8 g carboidrati, 0,5 g zuccheri, 8,0 g fibre, 6,0 g proteine, 0,05 g sale.
1094) Yam (Igname africano): 118 kcal, 0,2 g grassi, 0,0 g grassi saturi, 27,9 g carboidrati, 0,5 g zuccheri, 4,1 g fibre, 1,5 g proteine, 0,01 g sale.
1095) Yam Viola (Ube): 120 kcal, 0,2 g grassi, 0,0 g grassi saturi, 28,5 g carboidrati, 1,5 g zuccheri, 4,0 g fibre, 1,6 g proteine, 0,01 g sale.
1096) Zucca Kabocha: 35 kcal, 0,1 g grassi, 0,0 g grassi saturi, 8,5 g carboidrati, 3,0 g zuccheri, 1,5 g fibre, 1,2 g proteine, 0,01 g sale.
1097) Zucca Spaghetti: 31 kcal, 0,6 g grassi, 0,1 g grassi saturi, 7,0 g carboidrati, 2,8 g zuccheri, 1,5 g fibre, 0,6 g proteine, 0,01 g sale.
1098) Zucca Hokkaido: 37 kcal, 0,1 g grassi, 0,0 g grassi saturi, 8,8 g carboidrati, 3,5 g zuccheri, 1,8 g fibre, 1,3 g proteine, 0,01 g sale.
1099) Zucca Mantovana: 26 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,5 g carboidrati, 2,8 g zuccheri, 0,5 g fibre, 1,0 g proteine, 0,01 g sale.
1100) Zucca Marina di Chioggia: 28 kcal, 0,1 g grassi, 0,0 g grassi saturi, 7,0 g carboidrati, 3,0 g zuccheri, 0,6 g fibre, 1,1 g proteine, 0,01 g sale.
1101) Zucca Turbante Turco: 30 kcal, 0,1 g grassi, 0,0 g grassi saturi, 7,5 g carboidrati, 3,2 g zuccheri, 1,0 g fibre, 1,2 g proteine, 0,01 g sale.
1102) Zucchina Napoletana (Lunga): 16 kcal, 0,3 g grassi, 0,1 g grassi saturi, 3,1 g carboidrati, 2,5 g zuccheri, 1,1 g fibre, 1,2 g proteine, 0,02 g sale.
1103) Zucchina Romanesca: 17 kcal, 0,3 g grassi, 0,1 g grassi saturi, 3,2 g carboidrati, 2,6 g zuccheri, 1,2 g fibre, 1,3 g proteine, 0,02 g sale.
1104) Zucchina Tonda di Piacenza: 16 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,3 g carboidrati, 2,5 g zuccheri, 1,0 g fibre, 1,2 g proteine, 0,02 g sale.
1105) Zucchina Trombetta d'Albenga: 15 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,0 g carboidrati, 2,2 g zuccheri, 1,0 g fibre, 1,1 g proteine, 0,02 g sale
1107) Ceci in scatola (confezionati): 120 kcal, 2,2 g grassi, 0,3 g grassi saturi, 15,0 g carboidrati, 0,8 g zuccheri, 5,5 g fibre, 7,0 g proteine, 0,80 g sale.
1108) Fagioli Borlotti in scatola (confezionati): 95 kcal, 0,6 g grassi, 0,1 g grassi saturi, 13,5 g carboidrati, 0,5 g zuccheri, 6,2 g fibre, 7,0 g proteine, 0,75 g sale.
1109) Fagioli Cannellini in scatola (confezionati): 85 kcal, 0,5 g grassi, 0,1 g grassi saturi, 12,0 g carboidrati, 0,5 g zuccheri, 5,8 g fibre, 6,5 g proteine, 0,70 g sale.
1110) Fagioli Rossi Kidney in scatola (confezionati): 105 kcal, 0,5 g grassi, 0,1 g grassi saturi, 15,5 g carboidrati, 1,0 g zuccheri, 6,5 g fibre, 7,5 g proteine, 0,80 g sale.
1111) Fagioli Neri in scatola (confezionati): 110 kcal, 0,6 g grassi, 0,1 g grassi saturi, 16,0 g carboidrati, 0,8 g zuccheri, 7,0 g fibre, 8,0 g proteine, 0,85 g sale.
1112) Lenticchie in scatola (confezionati): 82 kcal, 0,5 g grassi, 0,1 g grassi saturi, 11,5 g carboidrati, 0,5 g zuccheri, 4,5 g fibre, 6,5 g proteine, 0,75 g sale.
1113) Piselli fini in scatola (confezionati): 75 kcal, 0,5 g grassi, 0,1 g grassi saturi, 10,0 g carboidrati, 2,5 g zuccheri, 5,0 g fibre, 5,5 g proteine, 0,70 g sale.
1114) Fave in scatola (confezionati): 80 kcal, 0,5 g grassi, 0,1 g grassi saturi, 10,5 g carboidrati, 1,5 g zuccheri, 6,0 g fibre, 6,0 g proteine, 0,80 g sale.
1115) Lupini in salamoia (confezionati): 115 kcal, 2,4 g grassi, 0,3 g grassi saturi, 9,2 g carboidrati, 0,5 g zuccheri, 4,8 g fibre, 14,0 g proteine, 2,80 g sale.
1116) Misto legumi per insalata (confezionati): 98 kcal, 0,7 g grassi, 0,1 g grassi saturi, 13,0 g carboidrati, 0,8 g zuccheri, 6,0 g fibre, 7,2 g proteine, 0,78 g sale.
1118) Passata di pomodoro (confezionati): 24 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 3,5 g zuccheri, 1,2 g fibre, 1,3 g proteine, 0,50 g sale.
1119) Polpa di pomodoro in pezzi (confezionati): 22 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,8 g carboidrati, 3,2 g zuccheri, 1,2 g fibre, 1,2 g proteine, 0,40 g sale.
1120) Pelati in scatola (confezionati): 21 kcal, 0,1 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 3,0 g zuccheri, 1,0 g fibre, 1,1 g proteine, 0,30 g sale.
1121) Concentrato di pomodoro (confezionati): 82 kcal, 0,5 g grassi, 0,1 g grassi saturi, 14,5 g carboidrati, 12,0 g zuccheri, 4,5 g fibre, 4,3 g proteine, 1,50 g sale.
1122) Pomodori secchi sott'olio (confezionati): 250 kcal, 18,0 g grassi, 2,5 g grassi saturi, 15,0 g carboidrati, 10,0 g zuccheri, 6,0 g fibre, 5,5 g proteine, 3,00 g sale.
1124) Mais dolce in scatola (confezionati): 80 kcal, 1,2 g grassi, 0,2 g grassi saturi, 14,0 g carboidrati, 5,5 g zuccheri, 2,5 g fibre, 2,5 g proteine, 0,60 g sale.
1125) Asparagi in vetro (confezionati): 20 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,2 g carboidrati, 1,5 g zuccheri, 1,5 g fibre, 2,0 g proteine, 0,90 g sale.
1126) Cuori di carciofo al naturale (confezionati): 45 kcal, 0,4 g grassi, 0,1 g grassi saturi, 5,5 g carboidrati, 1,0 g zuccheri, 5,0 g fibre, 2,5 g proteine, 0,85 g sale.
1127) Carciofini sott'olio (confezionati): 190 kcal, 17,5 g grassi, 2,0 g grassi saturi, 4,5 g carboidrati, 1,2 g zuccheri, 4,0 g fibre, 2,2 g proteine, 1,20 g sale.
1128) Funghi champignon al naturale (confezionati): 22 kcal, 0,3 g grassi, 0,1 g grassi saturi, 1,5 g carboidrati, 0,5 g zuccheri, 2,2 g fibre, 2,3 g proteine, 0,80 g sale.
1129) Fagiolini al naturale (confezionati): 25 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,5 g carboidrati, 1,8 g zuccheri, 2,5 g fibre, 1,5 g proteine, 0,75 g sale.
1130) Barbabietole precotte sottovuoto (confezionati): 43 kcal, 0,2 g grassi, 0,0 g grassi saturi, 8,5 g carboidrati, 7,0 g zuccheri, 2,8 g fibre, 1,6 g proteine, 0,15 g sale.
1131) Crauti al naturale (confezionati): 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 1,2 g zuccheri, 2,5 g fibre, 1,1 g proteine, 1,50 g sale.
1132) Olive verdi in salamoia (confezionati): 145 kcal, 15,0 g grassi, 2,4 g grassi saturi, 1,0 g carboidrati, 0,1 g zuccheri, 3,0 g fibre, 1,0 g proteine, 3,50 g sale.
1133) Olive nere in salamoia (confezionati): 165 kcal, 17,0 g grassi, 2,8 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 2,5 g fibre, 1,2 g proteine, 3,20 g sale.
1134) Cetriolini sott'aceto (confezionati): 15 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,0 g carboidrati, 1,2 g zuccheri, 1,2 g fibre, 0,8 g proteine, 2,00 g sale.
1135) Cipolline sott'aceto (confezionati): 28 kcal, 0,1 g grassi, 0,0 g grassi saturi, 5,5 g carboidrati, 4,8 g zuccheri, 1,5 g fibre, 0,8 g proteine, 1,80 g sale.
1136) Giardiniera in agrodolce (confezionati): 25 kcal, 0,2 g grassi, 0,0 g grassi saturi, 4,0 g carboidrati, 3,5 g zuccheri, 2,0 g fibre, 1,0 g proteine, 1,50 g sale.
1137) Peperoni grigliati sott'olio (confezionati): 140 kcal, 12,5 g grassi, 1,5 g grassi saturi, 5,2 g carboidrati, 4,0 g zuccheri, 2,0 g fibre, 1,0 g proteine, 1,10 g sale.
1138) Germogli di soia in scatola (confezionati): 25 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,5 g carboidrati, 1,5 g zuccheri, 1,8 g fibre, 2,8 g proteine, 0,65 g sale.
1140) Capperi sotto sale (da sciacquare): 40 kcal, 0,5 g grassi, 0,1 g grassi saturi, 5,0 g carboidrati, 0,5 g zuccheri, 3,0 g fibre, 2,5 g proteine, 20,00 g sale.
1141) Capperi sott'aceto: 25 kcal, 0,7 g grassi, 0,1 g grassi saturi, 2,0 g carboidrati, 0,4 g zuccheri, 3,2 g fibre, 2,0 g proteine, 3,00 g sale.
1142) Cetriolini sott'aceto: 15 kcal, 0,2 g grassi, 0,1 g grassi saturi, 2,5 g carboidrati, 1,2 g zuccheri, 1,2 g fibre, 1,0 g proteine, 2,00 g sale.
1143) Cipolline sott'aceto: 35 kcal, 0,1 g grassi, 0 g grassi saturi, 7,0 g carboidrati, 5,5 g zuccheri, 1,5 g fibre, 0,8 g proteine, 1,80 g sale.
1144) Olive Verdi in salamoia: 145 kcal, 15,0 g grassi, 2,2 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 3,5 g fibre, 1,0 g proteine, 3,50 g sale.
1145) Olive Nere in salamoia: 235 kcal, 24,0 g grassi, 3,5 g grassi saturi, 1,5 g carboidrati, 0,5 g zuccheri, 4,0 g fibre, 1,5 g proteine, 3,00 g sale.
1146) Olive Nere greche (tipo Kalamata): 260 kcal, 26,0 g grassi, 4,0 g grassi saturi, 2,0 g carboidrati, 0,5 g zuccheri, 4,5 g fibre, 2,0 g proteine, 4,50 g sale.
1147) Peperoncini sott'aceto: 28 kcal, 0,4 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 3,5 g zuccheri, 2,0 g fibre, 1,0 g proteine, 2,50 g sale.
1148) Giardiniera sott'aceto: 18 kcal, 0,2 g grassi, 0 g grassi saturi, 3,0 g carboidrati, 2,5 g zuccheri, 1,8 g fibre, 0,8 g proteine, 2,20 g sale.
1149) Pasta d'acciughe (tubetto): 160 kcal, 10,0 g grassi, 2,5 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 17,0 g proteine, 15,00 g sale.
1151) Pepe Nero macinato: 250 kcal, 3,3 g grassi, 1,0 g grassi saturi, 64,0 g carboidrati, 0,6 g zuccheri, 25,0 g fibre, 10,5 g proteine, 0,05 g sale.
1152) Peperoncino in polvere: 280 kcal, 14,0 g grassi, 2,5 g grassi saturi, 50,0 g carboidrati, 10,0 g zuccheri, 27,0 g fibre, 13,0 g proteine, 0,08 g sale.
1153) Curcuma in polvere: 312 kcal, 3,3 g grassi, 1,8 g grassi saturi, 67,0 g carboidrati, 3,2 g zuccheri, 21,0 g fibre, 9,5 g proteine, 0,07 g sale.
1154) Curry in polvere (mix): 325 kcal, 14,0 g grassi, 2,2 g grassi saturi, 55,0 g carboidrati, 2,5 g zuccheri, 33,0 g fibre, 14,0 g proteine, 0,13 g sale.
1155) Paprica dolce: 290 kcal, 13,0 g grassi, 2,1 g grassi saturi, 53,0 g carboidrati, 10,0 g zuccheri, 35,0 g fibre, 14,5 g proteine, 0,08 g sale.
1156) Paprica affumicata: 285 kcal, 12,5 g grassi, 2,0 g grassi saturi, 52,0 g carboidrati, 9,5 g zuccheri, 34,0 g fibre, 14,0 g proteine, 0,10 g sale.
1157) Zenzero in polvere: 335 kcal, 4,2 g grassi, 1,4 g grassi saturi, 71,0 g carboidrati, 3,4 g zuccheri, 14,0 g fibre, 9,0 g proteine, 0,08 g sale.
1158) Cannella in polvere: 247 kcal, 1,2 g grassi, 0,3 g grassi saturi, 80,0 g carboidrati, 2,2 g zuccheri, 53,0 g fibre, 4,0 g proteine, 0,02 g sale.
1159) Cumino in polvere: 375 kcal, 22,0 g grassi, 1,5 g grassi saturi, 44,0 g carboidrati, 2,2 g zuccheri, 10,0 g fibre, 18,0 g proteine, 0,40 g sale.
1160) Chiodi di garofano macinati: 274 kcal, 13,0 g grassi, 4,0 g grassi saturi, 65,0 g carboidrati, 2,4 g zuccheri, 34,0 g fibre, 6,0 g proteine, 0,25 g sale.
1161) Noce moscata: 525 kcal, 36,0 g grassi, 26,0 g grassi saturi, 49,0 g carboidrati, 28,0 g zuccheri, 21,0 g fibre, 6,0 g proteine, 0,04 g sale.
1162) Zafferano (pistilli o polvere): 310 kcal, 6,0 g grassi, 1,6 g grassi saturi, 65,0 g carboidrati, 0 g zuccheri, 4,0 g fibre, 11,5 g proteine, 0,35 g sale.
1164) Origano secco: 265 kcal, 4,3 g grassi, 1,5 g grassi saturi, 69,0 g carboidrati, 4,0 g zuccheri, 42,0 g fibre, 9,0 g proteine, 0,06 g sale.
1165) Rosmarino secco: 330 kcal, 15,0 g grassi, 7,0 g grassi saturi, 64,0 g carboidrati, 0 g zuccheri, 42,0 g fibre, 5,0 g proteine, 0,13 g sale.
1166) Salvia secca: 315 kcal, 13,0 g grassi, 7,0 g grassi saturi, 60,0 g carboidrati, 1,7 g zuccheri, 40,0 g fibre, 10,5 g proteine, 0,03 g sale.
1167) Timo secco: 276 kcal, 7,4 g grassi, 2,7 g grassi saturi, 64,0 g carboidrati, 1,7 g zuccheri, 37,0 g fibre, 9,0 g proteine, 0,14 g sale.
1168) Maggiorana secca: 270 kcal, 7,0 g grassi, 0,5 g grassi saturi, 60,0 g carboidrati, 4,0 g zuccheri, 40,0 g fibre, 12,5 g proteine, 0,20 g sale.
1169) Alloro secco: 313 kcal, 8,4 g grassi, 2,3 g grassi saturi, 75,0 g carboidrati, 0 g zuccheri, 26,0 g fibre, 7,5 g proteine, 0,06 g sale.
1171) Basilico fresco: 23 kcal, 0,6 g grassi, 0,1 g grassi saturi, 2,7 g carboidrati, 0,3 g zuccheri, 1,6 g fibre, 3,2 g proteine, 0,01 g sale.
1172) Prezzemolo fresco: 36 kcal, 0,8 g grassi, 0,1 g grassi saturi, 6,3 g carboidrati, 0,8 g zuccheri, 3,3 g fibre, 3,0 g proteine, 0,14 g sale.
1173) Menta fresca: 70 kcal, 0,9 g grassi, 0,2 g grassi saturi, 15,0 g carboidrati, 0 g zuccheri, 8,0 g fibre, 3,8 g proteine, 0,08 g sale.
1174) Erba cipollina fresca: 30 kcal, 0,7 g grassi, 0,1 g grassi saturi, 4,4 g carboidrati, 1,8 g zuccheri, 2,5 g fibre, 3,3 g proteine, 0,01 g sale.
1175) Dill (Aneto) fresco: 43 kcal, 1,1 g grassi, 0,1 g grassi saturi, 7,0 g carboidrati, 0 g zuccheri, 2,1 g fibre, 3,5 g proteine, 0,15 g sale.
1177) Maionese classica: 680 kcal, 75,0 g grassi, 11,5 g grassi saturi, 3,0 g carboidrati, 2,5 g zuccheri, 0 g fibre, 1,0 g proteine, 1,50 g sale.
1178) Maionese Light: 250 kcal, 22,0 g grassi, 3,5 g grassi saturi, 12,0 g carboidrati, 5,0 g zuccheri, 0,2 g fibre, 0,5 g proteine, 1,80 g sale.
1179) Ketchup: 100 kcal, 0,1 g grassi, 0 g grassi saturi, 23,0 g carboidrati, 22,0 g zuccheri, 0,5 g fibre, 1,2 g proteine, 2,50 g sale.
1180) Senape delicata: 90 kcal, 5,0 g grassi, 0,3 g grassi saturi, 5,0 g carboidrati, 2,0 g zuccheri, 3,0 g fibre, 6,0 g proteine, 3,00 g sale.
1181) Senape di Digione: 150 kcal, 11,0 g grassi, 0,8 g grassi saturi, 5,5 g carboidrati, 1,5 g zuccheri, 3,5 g fibre, 7,0 g proteine, 5,50 g sale.
1182) Salsa BBQ: 170 kcal, 0,5 g grassi, 0,1 g grassi saturi, 40,0 g carboidrati, 35,0 g zuccheri, 1,0 g fibre, 1,5 g proteine, 2,80 g sale.
1183) Salsa di Soia (Shoyu): 55 kcal, 0,1 g grassi, 0 g grassi saturi, 6,0 g carboidrati, 0,5 g zuccheri, 0,8 g fibre, 8,0 g proteine, 14,00 g sale.
1184) Salsa di Soia Tamari (Senza Glutine): 60 kcal, 0,1 g grassi, 0 g grassi saturi, 5,5 g carboidrati, 0,5 g zuccheri, 0,8 g fibre, 10,0 g proteine, 13,50 g sale.
1185) Tabasco (Salsa di peperoncino): 12 kcal, 0,5 g grassi, 0,1 g grassi saturi, 1,5 g carboidrati, 0 g zuccheri, 0,5 g fibre, 1,0 g proteine, 1,80 g sale.
1186) Pesto alla Genovese (confezionato): 520 kcal, 52,0 g grassi, 8,5 g grassi saturi, 5,5 g carboidrati, 3,5 g zuccheri, 2,5 g fibre, 5,0 g proteine, 3,20 g sale.
1187) Pesto Rosso (confezionato): 380 kcal, 35,0 g grassi, 5,5 g grassi saturi, 12,0 g carboidrati, 6,5 g zuccheri, 3,0 g fibre, 4,5 g proteine, 3,00 g sale.
1188) Anice Stellato (intero): 337 kcal, 16,0 g grassi, 0,6 g grassi saturi, 50,0 g carboidrati, 0 g zuccheri, 15,0 g fibre, 18,0 g proteine, 0,04 g sale.
1189) Semi di Finocchio: 345 kcal, 15,0 g grassi, 0,5 g grassi saturi, 52,0 g carboidrati, 0 g zuccheri, 40,0 g fibre, 16,0 g proteine, 0,22 g sale.
1190) Semi di Coriandolo: 298 kcal, 17,8 g grassi, 1,0 g grassi saturi, 55,0 g carboidrati, 0 g zuccheri, 42,0 g fibre, 12,0 g proteine, 0,09 g sale.
1191) Semi di Cumino Nero (Nigella): 345 kcal, 15,0 g grassi, 0,5 g grassi saturi, 52,0 g carboidrati, 0 g zuccheri, 40,0 g fibre, 16,0 g proteine, 0,20 g sale.
1192) Cardamomo (semi in polvere): 311 kcal, 6,7 g grassi, 0,7 g grassi saturi, 68,0 g carboidrati, 0 g zuccheri, 28,0 g fibre, 11,0 g proteine, 0,04 g sale.
1193) Semi di Papavero: 525 kcal, 41,5 g grassi, 4,5 g grassi saturi, 28,0 g carboidrati, 3,0 g zuccheri, 19,5 g fibre, 18,0 g proteine, 0,06 g sale.
1194) Semi di Sesamo Bianchi: 573 kcal, 49,5 g grassi, 7,0 g grassi saturi, 23,5 g carboidrati, 0,3 g zuccheri, 11,8 g fibre, 17,7 g proteine, 0,03 g sale.
1195) Semi di Sesamo Neri: 565 kcal, 48,0 g grassi, 6,8 g grassi saturi, 25,0 g carboidrati, 0,5 g zuccheri, 14,0 g fibre, 18,0 g proteine, 0,03 g sale.
1196) Fieno Greco (semi): 323 kcal, 6,4 g grassi, 0,7 g grassi saturi, 58,0 g carboidrati, 0 g zuccheri, 24,5 g fibre, 23,0 g proteine, 0,17 g sale.
1197) Semi di Sedano (macinati): 392 kcal, 25,0 g grassi, 2,2 g grassi saturi, 41,0 g carboidrati, 0,7 g zuccheri, 12,0 g fibre, 18,0 g proteine, 0,40 g sale.
1199) Garam Masala (mix indiano): 340 kcal, 12,0 g grassi, 1,5 g grassi saturi, 58,0 g carboidrati, 2,0 g zuccheri, 30,0 g fibre, 13,0 g proteine, 0,15 g sale.
1200) Ras el Hanout (mix nordafricano): 330 kcal, 11,0 g grassi, 1,8 g grassi saturi, 55,0 g carboidrati, 3,0 g zuccheri, 28,0 g fibre, 12,0 g proteine, 0,20 g sale.
1201) Spezie per Tacos (mix messicano): 280 kcal, 8,0 g grassi, 1,2 g grassi saturi, 45,0 g carboidrati, 15,0 g zuccheri, 10,0 g fibre, 10,0 g proteine, 15,00 g sale.
1202) Baharat (mix mediorientale): 315 kcal, 10,0 g grassi, 1,4 g grassi saturi, 52,0 g carboidrati, 2,5 g zuccheri, 25,0 g fibre, 11,0 g proteine, 0,12 g sale.
1203) Spezie per Vin BrulÃ© (mix intero): 260 kcal, 4,0 g grassi, 0,8 g grassi saturi, 65,0 g carboidrati, 10,0 g zuccheri, 35,0 g fibre, 5,0 g proteine, 0,05 g sale.
1204) Shichimi Togarashi (mix giapponese): 380 kcal, 15,0 g grassi, 2,2 g grassi saturi, 48,0 g carboidrati, 5,0 g zuccheri, 18,0 g fibre, 14,0 g proteine, 1,50 g sale.
1205) Za'atar (mix con sesamo e timo): 410 kcal, 28,0 g grassi, 4,0 g grassi saturi, 35,0 g carboidrati, 1,5 g zuccheri, 15,0 g fibre, 12,0 g proteine, 3,50 g sale.
1206) Cinque Spezie Cinesi: 320 kcal, 9,0 g grassi, 1,2 g grassi saturi, 60,0 g carboidrati, 1,5 g zuccheri, 32,0 g fibre, 10,0 g proteine, 0,10 g sale.
1208) Pepe Verde (in salamoia): 85 kcal, 2,0 g grassi, 0,5 g grassi saturi, 15,0 g carboidrati, 0,5 g zuccheri, 5,0 g fibre, 2,0 g proteine, 4,50 g sale.
1209) Pepe Rosa (bacche intere): 320 kcal, 14,0 g grassi, 2,5 g grassi saturi, 45,0 g carboidrati, 5,0 g zuccheri, 12,0 g fibre, 10,0 g proteine, 0,02 g sale.
1210) Pepe Bianco macinato: 296 kcal, 2,1 g grassi, 0,6 g grassi saturi, 68,0 g carboidrati, 0,1 g zuccheri, 26,0 g fibre, 10,4 g proteine, 0,02 g sale.
1211) Zenzero fresco (radice): 80 kcal, 0,8 g grassi, 0,2 g grassi saturi, 18,0 g carboidrati, 1,7 g zuccheri, 2,0 g fibre, 1,8 g proteine, 0,01 g sale.
1212) Rafano fresco (radice): 48 kcal, 0,7 g grassi, 0,1 g grassi saturi, 11,0 g carboidrati, 8,0 g zuccheri, 3,3 g fibre, 1,2 g proteine, 0,01 g sale.
1213) Wasabi in polvere (preparato): 350 kcal, 10,0 g grassi, 1,5 g grassi saturi, 55,0 g carboidrati, 20,0 g zuccheri, 8,0 g fibre, 12,0 g proteine, 1,20 g sale.
1214) Galanga (essiccata): 310 kcal, 2,5 g grassi, 0,5 g grassi saturi, 70,0 g carboidrati, 2,0 g zuccheri, 12,0 g fibre, 6,0 g proteine, 0,08 g sale.
1215) Lemongrass (fresco): 99 kcal, 0,5 g grassi, 0,1 g grassi saturi, 25,0 g carboidrati, 0 g zuccheri, 0 g fibre, 1,8 g proteine, 0,01 g sale.
1216) Sommacco (Sumac) in polvere: 240 kcal, 12,0 g grassi, 2,0 g grassi saturi, 38,0 g carboidrati, 2,0 g zuccheri, 15,0 g fibre, 6,0 g proteine, 1,50 g sale.
1217) Pimento (Allspice) macinato: 263 kcal, 8,7 g grassi, 2,5 g grassi saturi, 72,0 g carboidrati, 0 g zuccheri, 21,6 g fibre, 6,1 g proteine, 0,19 g sale.
1218) Mace (Fiori di Noce Moscata): 475 kcal, 32,0 g grassi, 10,0 g grassi saturi, 50,0 g carboidrati, 25,0 g zuccheri, 20,0 g fibre, 6,7 g proteine, 0,20 g sale.
1219) Aglio in polvere: 330 kcal, 0,7 g grassi, 0,2 g grassi saturi, 72,0 g carboidrati, 24,0 g zuccheri, 9,0 g fibre, 16,5 g proteine, 0,15 g sale.
1221) Sale Rosa dell'Himalaya: 0 kcal, 0 g grassi, 0 g carboidrati, 0 g proteine, 97,00 g sale.
1222) Sale Marino Integrale: 0 kcal, 0 g grassi, 0 g carboidrati, 0 g proteine, 94,00 g sale.
1223) Sale Affumicato: 0 kcal, 0 g grassi, 0 g carboidrati, 0 g proteine, 96,00 g sale.
1224) Sale di Sedano (mix): 15 kcal, 0,5 g grassi, 2,0 g carboidrati, 1,0 g proteine, 75,00 g sale.
1226) Peperoncino Chipotle (affumicato): 280 kcal, 13,0 g grassi, 2,2 g grassi saturi, 50,0 g carboidrati, 8,0 g zuccheri, 28,0 g fibre, 12,0 g proteine, 0,15 g sale.
1227) Peperoncino Ancho (dolce/fruttato): 285 kcal, 12,0 g grassi, 2,0 g grassi saturi, 52,0 g carboidrati, 12,0 g zuccheri, 25,0 g fibre, 11,5 g proteine, 0,10 g sale.
1228) Peperoncino Cayenne in polvere: 318 kcal, 17,0 g grassi, 3,2 g grassi saturi, 56,0 g carboidrati, 10,0 g zuccheri, 27,0 g fibre, 12,0 g proteine, 0,08 g sale.
1229) Peperoncino Habanero (estremamente piccante): 310 kcal, 15,0 g grassi, 2,5 g grassi saturi, 54,0 g carboidrati, 9,0 g zuccheri, 26,0 g fibre, 13,0 g proteine, 0,05 g sale.
1230) Fiocchi di Peperoncino (Crushed Red Pepper): 300 kcal, 14,0 g grassi, 2,5 g grassi saturi, 50,0 g carboidrati, 7,0 g zuccheri, 30,0 g fibre, 12,0 g proteine, 0,10 g sale.
1231) Peperoncino Aleppino (Pul Biber): 320 kcal, 16,0 g grassi, 2,8 g grassi saturi, 48,0 g carboidrati, 9,0 g zuccheri, 22,0 g fibre, 12,0 g proteine, 2,50 g sale (spesso contiene sale aggiunto).
1233) Vaniglia in bacca (semi interni): 288 kcal, 12,0 g grassi, 2,5 g grassi saturi, 12,0 g carboidrati, 12,0 g zuccheri, 25,0 g fibre, 4,0 g proteine, 0,02 g sale.
1234) Estratto di Vaniglia (liquido): 250 kcal, 0,1 g grassi, 0 g grassi saturi, 12,0 g carboidrati, 12,0 g zuccheri, 0 g fibre, 0,1 g proteine, 0,02 g sale.
1235) Vanillina (sintetica): 390 kcal, 0 g grassi, 0 g grassi saturi, 98,0 g carboidrati, 98,0 g zuccheri, 0 g fibre, 0 g proteine, 0 g sale.
1236) Fava Tonka (grattugiata): 450 kcal, 25,0 g grassi, 10,0 g grassi saturi, 45,0 g carboidrati, 5,0 g zuccheri, 15,0 g fibre, 8,0 g proteine, 0,01 g sale.
1237) Lavanda alimentare (fiori secchi): 49 kcal, 0,5 g grassi, 0,1 g grassi saturi, 10,0 g carboidrati, 0 g zuccheri, 8,0 g fibre, 1,0 g proteine, 0,05 g sale.
1238) Liquirizia in polvere (pura): 320 kcal, 0,5 g grassi, 0,1 g grassi saturi, 75,0 g carboidrati, 15,0 g zuccheri, 5,0 g fibre, 4,0 g proteine, 0,10 g sale.
1240) Semi di Chia: 486 kcal, 31,0 g grassi, 3,3 g grassi saturi, 42,0 g carboidrati, 0 g zuccheri, 34,0 g fibre, 16,5 g proteine, 0,04 g sale.
1241) Semi di Zucca (decorticati): 559 kcal, 49,0 g grassi, 8,7 g grassi saturi, 10,7 g carboidrati, 1,4 g zuccheri, 6,0 g fibre, 30,0 g proteine, 0,02 g sale.
1242) Semi di Girasole: 584 kcal, 51,0 g grassi, 4,5 g grassi saturi, 20,0 g carboidrati, 2,6 g zuccheri, 8,6 g fibre, 21,0 g proteine, 0,03 g sale.
1243) Semi di Canapa (decorticati): 553 kcal, 48,0 g grassi, 4,5 g grassi saturi, 8,0 g carboidrati, 1,5 g zuccheri, 4,0 g fibre, 31,0 g proteine, 0,01 g sale.
1244) Semi di Senape Nera: 508 kcal, 36,0 g grassi, 2,0 g grassi saturi, 28,0 g carboidrati, 6,8 g zuccheri, 12,0 g fibre, 26,0 g proteine, 0,03 g sale.
1245) Semi di Senape Bianca: 470 kcal, 29,0 g grassi, 1,5 g grassi saturi, 35,0 g carboidrati, 7,0 g zuccheri, 15,0 g fibre, 25,0 g proteine, 0,03 g sale.
1247) Tandoori Masala (mix indiano): 320 kcal, 10,0 g grassi, 1,5 g grassi saturi, 50,0 g carboidrati, 5,0 g zuccheri, 25,0 g fibre, 12,0 g proteine, 2,50 g sale (spesso salato).
1248) Dukkah (mix egiziano con frutta secca): 520 kcal, 42,0 g grassi, 5,5 g grassi saturi, 22,0 g carboidrati, 3,0 g zuccheri, 12,0 g fibre, 18,0 g proteine, 1,50 g sale.
1249) Jerk Seasoning (mix giamaicano): 250 kcal, 6,0 g grassi, 1,0 g grassi saturi, 45,0 g carboidrati, 20,0 g zuccheri, 10,0 g fibre, 8,0 g proteine, 10,00 g sale.
1250) Furikake (condimento riso giapponese): 400 kcal, 18,0 g grassi, 3,0 g grassi saturi, 40,0 g carboidrati, 15,0 g zuccheri, 5,0 g fibre, 20,0 g proteine, 8,00 g sale.
1251) Advieh (mix persiano): 310 kcal, 8,0 g grassi, 1,2 g grassi saturi, 65,0 g carboidrati, 5,0 g zuccheri, 30,0 g fibre, 7,0 g proteine, 0,05 g sale.
1253) Cipolla in fiocchi (essiccata): 340 kcal, 0,5 g grassi, 0,1 g grassi saturi, 79,0 g carboidrati, 6,0 g zuccheri, 9,0 g fibre, 9,0 g proteine, 0,05 g sale.
1254) Ciboulette (Erba cipollina secca): 210 kcal, 3,5 g grassi, 0,6 g grassi saturi, 64,0 g carboidrati, 4,5 g zuccheri, 26,0 g fibre, 21,0 g proteine, 0,10 g sale.
1255) Dragoncello (Estragone) secco: 295 kcal, 7,0 g grassi, 1,8 g grassi saturi, 50,0 g carboidrati, 0 g zuccheri, 7,0 g fibre, 23,0 g proteine, 0,15 g sale.
1256) Cervoglio secco: 237 kcal, 3,9 g grassi, 0,2 g grassi saturi, 49,0 g carboidrati, 0 g zuccheri, 11,0 g fibre, 23,0 g proteine, 0,20 g sale.
1257) Kaffir Lime (foglie secche): 300 kcal, 5,0 g grassi, 1,0 g grassi saturi, 60,0 g carboidrati, 0 g zuccheri, 35,0 g fibre, 10,0 g proteine, 0,02 g sale.
1258) Pandan (foglie in polvere): 320 kcal, 2,0 g grassi, 0,5 g grassi saturi, 70,0 g carboidrati, 5,0 g zuccheri, 15,0 g fibre, 6,0 g proteine, 0,05 g sale.
1259) Assafetida (polvere): 295 kcal, 1,0 g grassi, 0,2 g grassi saturi, 68,0 g carboidrati, 0 g zuccheri, 4,0 g fibre, 4,0 g proteine, 0,03 g sale.
1260) Uovo di gallina sodo: 155 kcal, 10,6 g grassi, 3,3 g grassi saturi, 1,1 g carboidrati, 1,1 g zuccheri, 0 g fibre, 12,6 g proteine, 0,30 g sale.
1261) Uovo di gallina alla coque: 143 kcal, 9,5 g grassi, 3,1 g grassi saturi, 0,7 g carboidrati, 0,7 g zuccheri, 0 g fibre, 12,6 g proteine, 0,32 g sale
1263) Uovo di quaglia (intero): 158 kcal, 11,0 g grassi, 3,5 g grassi saturi, 0,4 g carboidrati, 0,4 g zuccheri, 0 g fibre, 13,0 g proteine, 0,35 g sale.
1264) Uovo di anatra (intero): 185 kcal, 13,8 g grassi, 3,7 g grassi saturi, 1,5 g carboidrati, 0,9 g zuccheri, 0 g fibre, 12,8 g proteine, 0,36 g sale.
1265) Uovo di oca (intero): 185 kcal, 13,3 g grassi, 3,6 g grassi saturi, 1,3 g carboidrati, 1,0 g zuccheri, 0 g fibre, 13,9 g proteine, 0,35 g sale.
1266) Uovo di tacchino (intero): 171 kcal, 11,9 g grassi, 3,6 g grassi saturi, 1,1 g carboidrati, 1,1 g zuccheri, 0 g fibre, 13,7 g proteine, 0,38 g sale.
1267) Uovo in polvere (intero disidratato): 595 kcal, 44,0 g grassi, 13,5 g grassi saturi, 4,5 g carboidrati, 4,5 g zuccheri, 0 g fibre, 45,0 g proteine, 1,20 g sale.
1268) Albume in polvere (disidratato): 370 kcal, 0,5 g grassi, 0,1 g grassi saturi, 4,5 g carboidrati, 4,5 g zuccheri, 0 g fibre, 82,0 g proteine, 3,10 g sale.
1269) Tuorlo in polvere (disidratato): 660 kcal, 57,0 g grassi, 21,0 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 32,0 g proteine, 0,50 g sale.
1271) Olio Extravergine di Oliva (EVO): 899 kcal, 99,9 g grassi, 14,5 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1272) Olio di Oliva (comune): 899 kcal, 99,9 g grassi, 13,5 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1273) Olio di Girasole: 884 kcal, 100,0 g grassi, 11,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1274) Olio di Girasole Alto Oleico: 884 kcal, 100,0 g grassi, 8,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1275) Olio di Mais: 884 kcal, 100,0 g grassi, 13,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1276) Olio di Arachidi: 884 kcal, 100,0 g grassi, 17,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1277) Olio di Soia: 884 kcal, 100,0 g grassi, 15,5 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1278) Olio di Riso: 884 kcal, 100,0 g grassi, 19,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1279) Olio di Vinaccioli (semi d'uva): 884 kcal, 100,0 g grassi, 10,5 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1280) Olio di Lino (uso alimentare): 884 kcal, 100,0 g grassi, 9,5 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1281) Olio di Cocco (solido/liquido): 862 kcal, 99,0 g grassi, 86,5 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1282) Olio di Avocado: 884 kcal, 100,0 g grassi, 11,5 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1283) Olio di Sesamo: 884 kcal, 100,0 g grassi, 14,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1284) Olio di Noce: 884 kcal, 100,0 g grassi, 9,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1285) Olio di Nocciola: 884 kcal, 100,0 g grassi, 7,5 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1286) Olio di Semi di Zucca: 884 kcal, 100,0 g grassi, 18,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1287) Olio di Palma (grezzo): 884 kcal, 100,0 g grassi, 49,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1289) Burro chiarificato (Ghee): 876 kcal, 99,0 g grassi, 62,0 g grassi saturi, 0,5 g carboidrati, 0,5 g proteine, 0 g sale.
1290) Strutto (Grasso di suino): 892 kcal, 99,0 g grassi, 39,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1291) Sego (Grasso di bovino): 900 kcal, 100,0 g grassi, 50,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1292) Margarina vegetale (100% vegetale): 715 kcal, 80,0 g grassi, 20,0 g grassi saturi, 0,5 g carboidrati, 0,2 g proteine, 0,50 g sale.
1293) Margarina vegetale Light (40% grassi): 360 kcal, 40,0 g grassi, 10,0 g grassi saturi, 1,5 g carboidrati, 0,2 g proteine, 0,60 g sale.
1295) Aceto di Vino Bianco: 18 kcal, 0 g grassi, 0 g grassi saturi, 0,6 g carboidrati, 0,6 g zuccheri, 0 g fibre, 0,1 g proteine, 0,02 g sale.
1296) Aceto di Vino Rosso: 19 kcal, 0 g grassi, 0 g grassi saturi, 0,3 g carboidrati, 0,3 g zuccheri, 0 g fibre, 0,1 g proteine, 0,02 g sale.
1297) Aceto di Mele: 21 kcal, 0 g grassi, 0 g grassi saturi, 0,9 g carboidrati, 0,4 g zuccheri, 0 g fibre, 0,1 g proteine, 0,01 g sale.
1298) Aceto Balsamico di Modena IGP: 120 kcal, 0 g grassi, 0 g grassi saturi, 25,0 g carboidrati, 25,0 g zuccheri, 0 g fibre, 0,5 g proteine, 0,10 g sale.
1299) Glassa all'Aceto Balsamico: 220 kcal, 0 g grassi, 0 g grassi saturi, 52,0 g carboidrati, 48,0 g zuccheri, 0 g fibre, 0,5 g proteine, 0,15 g sale.
1300) Aceto di Riso: 18 kcal, 0 g grassi, 0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 0,1 g proteine, 0,02 g sale.
1301) Aceto di Alcool (per conserve): 15 kcal, 0 g grassi, 0 g grassi saturi, 0,1 g carboidrati, 0 g zuccheri, 0 g fibre, 0 g proteine, 0,01 g sale.
1302) Succo di Limone (fresco): 22 kcal, 0,2 g grassi, 0 g grassi saturi, 6,9 g carboidrati, 2,5 g zuccheri, 0,3 g fibre, 0,4 g proteine, 0,01 g sale.
1303) Succo di Lime (fresco): 30 kcal, 0,2 g grassi, 0 g grassi saturi, 10,5 g carboidrati, 1,7 g zuccheri, 0,4 g fibre, 0,7 g proteine, 0,01 g sale.
1305) Tahina (crema di sesamo): 595 kcal, 54,0 g grassi, 8,0 g grassi saturi, 21,0 g carboidrati, 0,5 g zuccheri, 9,0 g fibre, 17,0 g proteine, 0,30 g sale.
1306) Pasta d'Aglio: 150 kcal, 0,5 g grassi, 0,1 g grassi saturi, 30,0 g carboidrati, 2,5 g zuccheri, 2,0 g fibre, 6,0 g proteine, 1,50 g sale.
1307) Pasta di Wasabi (tubetto): 290 kcal, 9,0 g grassi, 1,3 g grassi saturi, 46,0 g carboidrati, 18,0 g zuccheri, 5,0 g fibre, 5,0 g proteine, 3,50 g sale.
1308) Miso Chiaro (pasta di soia): 198 kcal, 6,0 g grassi, 1,0 g grassi saturi, 25,0 g carboidrati, 6,0 g zuccheri, 5,0 g fibre, 12,0 g proteine, 11,50 g sale.
1309) Miso Scuro: 190 kcal, 6,0 g grassi, 1,0 g grassi saturi, 20,0 g carboidrati, 2,0 g zuccheri, 5,0 g fibre, 14,0 g proteine, 12,50 g sale.
1311) Burro Salato: 717 kcal, 81,0 g grassi, 51,0 g grassi saturi, 0,6 g carboidrati, 0,6 g zuccheri, 0 g fibre, 0,8 g proteine, 2,00 g sale.
1312) Burro di Centrifuga (Alta QualitÃ ): 750 kcal, 83,0 g grassi, 53,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 0,6 g proteine, 0,02 g sale.
1313) Burro Alleggerito (metÃ  grassi): 380 kcal, 41,0 g grassi, 26,0 g grassi saturi, 2,0 g carboidrati, 1,5 g zuccheri, 0 g fibre, 1,0 g proteine, 0,10 g sale.
1314) Burro alle Erbe (confezionato): 680 kcal, 74,0 g grassi, 46,0 g grassi saturi, 2,5 g carboidrati, 1,5 g zuccheri, 0,5 g fibre, 1,2 g proteine, 1,50 g sale.
1315) Burro all'Aglio: 690 kcal, 75,0 g grassi, 47,0 g grassi saturi, 3,0 g carboidrati, 1,0 g zuccheri, 0,5 g fibre, 1,5 g proteine, 1,40 g sale.
1316) Burro di Bufala: 740 kcal, 82,0 g grassi, 55,0 g grassi saturi, 0,5 g carboidrati, 0,5 g zuccheri, 0 g fibre, 0,8 g proteine, 0,05 g sale.
1317) Burro di Capra: 735 kcal, 81,5 g grassi, 54,0 g grassi saturi, 0,4 g carboidrati, 0,4 g zuccheri, 0 g fibre, 0,9 g proteine, 0,05 g sale.
1319) Margarina con Fitosteroli (per il colesterolo): 450 kcal, 50,0 g grassi, 12,0 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 0,2 g proteine, 0,45 g sale.
1320) Margarina per Sfoglia (professionale): 720 kcal, 80,0 g grassi, 45,0 g grassi saturi, 0,5 g carboidrati, 0,2 g zuccheri, 0 g fibre, 0,1 g proteine, 0,10 g sale.
1321) Margarina al Mais: 710 kcal, 79,0 g grassi, 18,0 g grassi saturi, 0,5 g carboidrati, 0,2 g zuccheri, 0 g fibre, 0,2 g proteine, 0,50 g sale.
1322) Margarina senza Olio di Palma: 630 kcal, 70,0 g grassi, 15,0 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 0,2 g proteine, 0,40 g sale.
1323) Shortening vegetale (Grasso vegetale puro): 884 kcal, 100,0 g grassi, 50,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1325) Olio di Mandorle (uso alimentare): 884 kcal, 100,0 g grassi, 8,2 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1326) Olio di Pistacchio: 884 kcal, 100,0 g grassi, 13,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1327) Olio di Argan (uso alimentare): 884 kcal, 100,0 g grassi, 19,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1328) Olio di Canola (Colza a basso acido erucico): 884 kcal, 100,0 g grassi, 7,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1329) Olio di Cotone: 884 kcal, 100,0 g grassi, 26,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1330) Olio di Cartamo: 884 kcal, 100,0 g grassi, 6,5 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1331) Olio di Macadamia: 884 kcal, 100,0 g grassi, 12,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1332) Olio di Neem (tracce in integratori): 884 kcal, 100,0 g grassi, 30,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1334) Olio Extravergine Spray (1 secondo di erogazione ~1,8ml): 820 kcal (valore teorico per 100ml), 91,0 g grassi, 13,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1335) Olio al Peperoncino (infuso): 890 kcal, 99,0 g grassi, 14,5 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 0,2 g fibre, 0,1 g proteine, 0,01 g sale.
1336) Olio al Limone (infuso): 890 kcal, 99,0 g grassi, 14,5 g grassi saturi, 0,8 g carboidrati, 0,2 g zuccheri, 0 g fibre, 0 g proteine, 0,01 g sale.
1337) Olio al Basilico (infuso): 890 kcal, 99,0 g grassi, 14,5 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 0 g fibre, 0,1 g proteine, 0,01 g sale.
1339) Grasso d'Anatra (Duck Fat): 882 kcal, 99,8 g grassi, 33,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1340) Grasso d'Oca (Goose Fat): 895 kcal, 99,5 g grassi, 28,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1341) Grasso di Pollo (Schmaltz): 898 kcal, 99,8 g grassi, 30,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1342) Pane Grattugiato e Preparati per Panatura (Valori per 100 g)
1343) Pane grattugiato classico (di grano tenero): 350 kcal, 1,5 g grassi, 0,4 g grassi saturi, 70,0 g carboidrati, 3,5 g zuccheri, 4,5 g fibre, 12,0 g proteine, 1,50 g sale.
1344) Pane grattugiato integrale: 325 kcal, 2,5 g grassi, 0,6 g grassi saturi, 60,0 g carboidrati, 3,0 g zuccheri, 11,0 g fibre, 13,5 g proteine, 1,30 g sale.
1345) Panko (pane grattugiato giapponese): 365 kcal, 2,0 g grassi, 0,5 g grassi saturi, 75,0 g carboidrati, 4,0 g zuccheri, 2,5 g fibre, 11,0 g proteine, 1,10 g sale.
1346) Pane grattugiato senza glutine (riso/mais): 360 kcal, 2,2 g grassi, 0,5 g grassi saturi, 78,0 g carboidrati, 2,0 g zuccheri, 2,0 g fibre, 6,5 g proteine, 1,40 g sale.
1347) Pane grattugiato aromatizzato (erbe e aglio): 355 kcal, 3,5 g grassi, 0,8 g grassi saturi, 68,0 g carboidrati, 3,2 g zuccheri, 4,2 g fibre, 11,5 g proteine, 2,20 g sale.
1348) Pane grattugiato di mais (per panature croccanti): 370 kcal, 1,2 g grassi, 0,2 g grassi saturi, 80,0 g carboidrati, 1,5 g zuccheri, 3,5 g fibre, 8,0 g proteine, 0,05 g sale.
1349) Farina di Galletta (pane grattugiato finissimo): 380 kcal, 4,0 g grassi, 1,0 g grassi saturi, 72,0 g carboidrati, 5,0 g zuccheri, 3,0 g fibre, 12,0 g proteine, 1,80 g sale.
1351) Confettura di Fragole: 240 kcal, 0 g grassi, 58 g carboidrati, 55 g zuccheri, 1 g proteine, 0,02 g sale.
1352) Confettura di Fragole Extra (piÃ¹ frutta): 190 kcal, 0 g grassi, 45 g carboidrati, 42 g zuccheri, 0,8 g proteine, 0,01 g sale.
1353) Confettura di Albicocche: 245 kcal, 0 g grassi, 60 g carboidrati, 57 g zuccheri, 0,7 g proteine, 0,02 g sale.
1354) Marmellata di Arance (con scorzette): 250 kcal, 0 g grassi, 61 g carboidrati, 58 g zuccheri, 0,5 g proteine, 0,03 g sale.
1355) Marmellata di Arance Amare: 260 kcal, 0 g grassi, 63 g carboidrati, 60 g zuccheri, 0,4 g proteine, 0,03 g sale.
1356) Confettura di Ciliegie: 255 kcal, 0,2 g grassi, 62 g carboidrati, 59 g zuccheri, 0,8 g proteine, 0,02 g sale.
1357) Confettura di Amarene: 260 kcal, 0 g grassi, 63 g carboidrati, 60 g zuccheri, 1 g proteine, 0,02 g sale.
1358) Confettura di Pesche: 240 kcal, 0 g grassi, 58 g carboidrati, 55 g zuccheri, 0,6 g proteine, 0,02 g sale.
1359) Confettura di Frutti di Bosco: 245 kcal, 0,3 g grassi, 59 g carboidrati, 56 g zuccheri, 1,1 g proteine, 0,02 g sale.
1360) Confettura di Lamponi: 240 kcal, 0,3 g grassi, 57 g carboidrati, 54 g zuccheri, 1,2 g proteine, 0,01 g sale.
1361) Confettura di Mirtilli: 235 kcal, 0,2 g grassi, 56 g carboidrati, 53 g zuccheri, 0,7 g proteine, 0,01 g sale.
1362) Confettura di More: 230 kcal, 0,2 g grassi, 55 g carboidrati, 52 g zuccheri, 1,3 g proteine, 0,01 g sale.
1363) Confettura di Prugne/Susine: 240 kcal, 0 g grassi, 58 g carboidrati, 55 g zuccheri, 0,6 g proteine, 0,02 g sale.
1364) Confettura di Fichi: 265 kcal, 0,2 g grassi, 64 g carboidrati, 61 g zuccheri, 0,9 g proteine, 0,03 g sale.
1365) Confettura di Pere: 230 kcal, 0 g grassi, 56 g carboidrati, 53 g zuccheri, 0,4 g proteine, 0,02 g sale.
1366) Confettura di Mele e Cannella: 220 kcal, 0,1 g grassi, 54 g carboidrati, 51 g zuccheri, 0,3 g proteine, 0,02 g sale.
1367) Confettura di Cotogne (Cotognata): 280 kcal, 0 g grassi, 68 g carboidrati, 65 g zuccheri, 0,4 g proteine, 0,05 g sale.
1368) Marmellata di Limoni: 245 kcal, 0 g grassi, 60 g carboidrati, 57 g zuccheri, 0,5 g proteine, 0,04 g sale.
1370) Confettura 100% frutta (solo zuccheri della frutta): 150 kcal, 0,2 g grassi, 35 g carboidrati, 33 g zuccheri, 0,8 g proteine, 0,01 g sale.
1371) Confettura Light (ridotto contenuto calorico/dolcificanti): 80 kcal, 0 g grassi, 18 g carboidrati, 15 g zuccheri, 0,5 g proteine, 0,05 g sale.
1372) Confettura di Castagne (Crema di Marroni): 275 kcal, 1,2 g grassi, 62 g carboidrati, 55 g zuccheri, 1,5 g proteine, 0,03 g sale.
1373) Confettura di Pomodori Verdi: 230 kcal, 0,1 g grassi, 55 g carboidrati, 53 g zuccheri, 1,2 g proteine, 0,10 g sale.
1374) Confettura di Peperoncino: 260 kcal, 0,3 g grassi, 63 g carboidrati, 60 g zuccheri, 0,8 g proteine, 0,25 g sale.
1375) Confettura di Cipolle Rosse: 210 kcal, 0,1 g grassi, 50 g carboidrati, 48 g zuccheri, 1,1 g proteine, 0,30 g sale.
1377) Crema spalmabile Nocciole e Cacao (tipo Nutella): 539 kcal, 30,9 g grassi, 10,6 g grassi saturi, 57,5 g carboidrati, 56,3 g zuccheri, 6,3 g proteine, 0,10 g sale.
1378) Crema di Nocciole 100% (pura): 650 kcal, 60 g grassi, 4,5 g grassi saturi, 10 g carboidrati, 4 g zuccheri, 15 g proteine, 0,01 g sale.
1379) Crema di Pistacchio (dolce): 580 kcal, 38 g grassi, 12 g grassi saturi, 48 g carboidrati, 45 g zuccheri, 8 g proteine, 0,15 g sale.
1380) Crema di Pistacchio 100% (pura): 610 kcal, 50 g grassi, 6 g grassi saturi, 12 g carboidrati, 5 g zuccheri, 20 g proteine, 0,02 g sale.
1381) Crema di Mandorle (dolce): 570 kcal, 35 g grassi, 4 g grassi saturi, 52 g carboidrati, 48 g zuccheri, 9 g proteine, 0,10 g sale.
1382) Crema di Mandorle 100% (pura): 620 kcal, 52 g grassi, 4 g grassi saturi, 10 g carboidrati, 4 g zuccheri, 22 g proteine, 0,01 g sale.
1383) Crema di Arachidi (Burro d'Arachidi "Creamy"): 588 kcal, 50 g grassi, 10 g grassi saturi, 20 g carboidrati, 9 g zuccheri, 25 g proteine, 0,40 g sale.
1384) Burro d'Arachidi "Crunchy" (con pezzi): 590 kcal, 50 g grassi, 10 g grassi saturi, 19 g carboidrati, 8 g zuccheri, 24 g proteine, 0,45 g sale.
1385) Burro d'Arachidi 100% (senza sale/zuccheri aggiunti): 600 kcal, 51 g grassi, 8 g grassi saturi, 12 g carboidrati, 5 g zuccheri, 28 g proteine, 0,01 g sale.
1386) Crema spalmabile al Cioccolato Bianco: 570 kcal, 36 g grassi, 12 g grassi saturi, 55 g carboidrati, 55 g zuccheri, 5 g proteine, 0,20 g sale.
1387) Crema spalmabile al Cioccolato Fondente: 540 kcal, 35 g grassi, 14 g grassi saturi, 45 g carboidrati, 42 g zuccheri, 6 g proteine, 0,05 g sale.
1388) Crema spalmabile al Caramello Salato: 450 kcal, 25 g grassi, 15 g grassi saturi, 55 g carboidrati, 52 g zuccheri, 2 g proteine, 1,20 g sale.
1389) Crema Lotus (Biscoff - biscotti caramellati): 584 kcal, 38 g grassi, 7 g grassi saturi, 57 g carboidrati, 36 g zuccheri, 3 g proteine, 0,50 g sale.
1390) Crema al Gianduia (Artigianale): 560 kcal, 36 g grassi, 9 g grassi saturi, 48 g carboidrati, 44 g zuccheri, 9 g proteine, 0,08 g sale.
1392) Miele (Millefiori/Acacia/Castagno): 304 kcal, 0 g grassi, 82 g carboidrati, 80 g zuccheri, 0,3 g proteine, 0,01 g sale.
1393) Sciroppo d'Acero: 260 kcal, 0 g grassi, 67 g carboidrati, 60 g zuccheri, 0 g proteine, 0,03 g sale.
1394) Sciroppo d'Agave: 310 kcal, 0,5 g grassi, 76 g carboidrati, 68 g zuccheri, 0 g proteine, 0,01 g sale.
1395) Melassa: 290 kcal, 0,1 g grassi, 75 g carboidrati, 70 g zuccheri, 0 g proteine, 0,10 g sale.
1396) Malto d'Orzo: 315 kcal, 0 g grassi, 77 g carboidrati, 50 g zuccheri, 4 g proteine, 0,15 g sale.
1397) Malto di Riso: 320 kcal, 0 g grassi, 80 g carboidrati, 55 g zuccheri, 1 g proteine, 0,10 g sale.
1399) Dulce de Leche (crema di latte): 315 kcal, 7 g grassi, 4 g grassi saturi, 55 g carboidrati, 52 g zuccheri, 6 g proteine, 0,30 g sale.
1400) Marmite (estratto di lievito - UK): 260 kcal, 0,5 g grassi, 30 g carboidrati, 1,2 g zuccheri, 34 g proteine, 10,80 g sale.
1401) Vegemite (estratto di lievito - Australia): 180 kcal, 0,5 g grassi, 20 g carboidrati, 2,5 g zuccheri, 25 g proteine, 8,50 g sale.
1402) Lemon Curd (crema di limone inglese): 300 kcal, 12 g grassi, 7 g grassi saturi, 45 g carboidrati, 42 g zuccheri, 2 g proteine, 0,20 g sale.
1403) Marshmallow Fluff (crema di marshmallow): 330 kcal, 0 g grassi, 84 g carboidrati, 50 g zuccheri, 1 g proteine, 0,10 g sale.
1404) Crema di Cocco (spalmabile dolce): 450 kcal, 30 g grassi, 26 g grassi saturi, 40 g carboidrati, 38 g zuccheri, 3 g proteine, 0,10 g sale.
1405) Nutella (Ferrero): 539 kcal, 30,9 g grassi, 10,6 g grassi saturi, 57,5 g carboidrati, 56,3 g zuccheri, 6,3 g proteine, 0,10 g sale.
1406) Crema Novi (45% nocciole): 546 kcal, 37,0 g grassi, 5,5 g grassi saturi, 41,0 g carboidrati, 38,0 g zuccheri, 10,0 g proteine, 0,05 g sale.
1407) Nocciolata Rigoni di Asiago (Classica): 533 kcal, 30,0 g grassi, 6,0 g grassi saturi, 54,0 g carboidrati, 51,0 g zuccheri, 8,2 g proteine, 0,11 g sale.
1408) Nocciolata Rigoni di Asiago (Senza Latte/Vegan): 536 kcal, 31,0 g grassi, 5,7 g grassi saturi, 53,0 g carboidrati, 51,0 g zuccheri, 6,0 g proteine, 0 g sale.
1409) Pan di Stelle Crema (Barilla): 527 kcal, 30,2 g grassi, 5,3 g grassi saturi, 53,1 g carboidrati, 51,0 g zuccheri, 8,3 g proteine, 0,11 g sale.
1410) Crema Valsoia (100% vegetale): 535 kcal, 32,0 g grassi, 5,6 g grassi saturi, 54,0 g carboidrati, 52,0 g zuccheri, 5,5 g proteine, 0,08 g sale.
1411) Lindt Crema Spalmabile Fondente: 550 kcal, 38,0 g grassi, 11,0 g grassi saturi, 44,0 g carboidrati, 40,0 g zuccheri, 5,4 g proteine, 0,10 g sale.
1412) Ovomaltine Crunchy Cream: 545 kcal, 32,0 g grassi, 7,1 g grassi saturi, 59,5 g carboidrati, 54,5 g zuccheri, 3,8 g proteine, 0,25 g sale.
1414) Santa Rosa (Albicocche - Confettura classica): 190 kcal, 0,1 g grassi, 46,0 g carboidrati, 43,0 g zuccheri, 0,4 g proteine, 0,02 g sale.
1415) Zuegg 100% da Frutta (Fragole): 141 kcal, 0,2 g grassi, 32,0 g carboidrati, 30,0 g zuccheri, 0,7 g proteine, 0,06 g sale.
1416) Fiordifrutta Rigoni di Asiago (Frutti di Bosco): 159 kcal, 0 g grassi, 38,0 g carboidrati, 35,0 g zuccheri, 0,7 g proteine, 0,05 g sale.
1417) Hero Light (Ciliegie - con dolcificanti): 71 kcal, 0,2 g grassi, 20,0 g carboidrati, 5,0 g zuccheri, 0,5 g proteine, 0,01 g sale.
1418) Marmellata di Arance Amare McVitie's: 255 kcal, 0,1 g grassi, 62,0 g carboidrati, 55,0 g zuccheri, 0,3 g proteine, 0,10 g sale.
1419) D'Arbo Naturrein (Lamponi - Extra): 191 kcal, 0,1 g grassi, 45,0 g carboidrati, 45,0 g zuccheri, 0,6 g proteine, 0 g sale.
1420) Bonne Maman (Confettura di Pesche): 241 kcal, 0,1 g grassi, 59,0 g carboidrati, 59,0 g zuccheri, 0,4 g proteine, 0 g sale.
1422) Lotus Biscoff Spalmabile (Originale): 584 kcal, 38,1 g grassi, 7,6 g grassi saturi, 57,0 g carboidrati, 36,8 g zuccheri, 2,9 g proteine, 0,54 g sale.
1423) Peanut Butter CalvÃ© (Classico): 647 kcal, 54,0 g grassi, 9,5 g grassi saturi, 11,0 g carboidrati, 6,4 g zuccheri, 21,0 g proteine, 0,58 g sale.
1424) Skippy Peanut Butter (Creamy): 588 kcal, 50,0 g grassi, 10,0 g grassi saturi, 20,0 g carboidrati, 10,0 g zuccheri, 23,0 g proteine, 1,20 g sale.
1425) Prozis Choco Butter (Alto proteico): 520 kcal, 36,0 g grassi, 8,0 g grassi saturi, 30,0 g carboidrati, 2,5 g zuccheri (polioli), 24,0 g proteine, 0,10 g sale.
1426) Crema di Arachidi Fiorentini (100% arachidi): 601 kcal, 48,9 g grassi, 6,4 g grassi saturi, 8,4 g carboidrati, 4,9 g zuccheri, 27,6 g proteine, 0,01 g sale.
1428) Mielizia Miele di Castagno: 304 kcal, 0 g grassi, 82,0 g carboidrati, 80,0 g zuccheri, 0,3 g proteine, 0,01 g sale.
1429) Sciroppo d'Acero MapleFarm (Grado A): 260 kcal, 0 g grassi, 67,0 g carboidrati, 60,0 g zuccheri, 0 g proteine, 0,03 g sale.
1430) Dulce de Leche Mardel: 310 kcal, 6,0 g grassi, 4,1 g grassi saturi, 57,0 g carboidrati, 55,0 g zuccheri, 7,0 g proteine, 0,30 g sale.
1431) Fluff Marshmallow Spread: 330 kcal, 0 g grassi, 84,0 g carboidrati, 50,0 g zuccheri, 1,0 g proteine, 0,10 g sale.
1432) Giraudi Crema Giacometta (32% Nocciole): 572 kcal, 40,0 g grassi, 12,0 g grassi saturi, 44,0 g carboidrati, 41,0 g zuccheri, 7,5 g proteine, 0,05 g sale.
1434) Foodspring Protein Cream (Nocciola): 519 kcal, 37,0 g grassi, 8,5 g grassi saturi, 33,0 g carboidrati, 7,2 g zuccheri (contiene polioli), 21,0 g proteine, 0,20 g sale.
1435) Prozis Whey Choco (Burro di arachidi e cioccolato): 540 kcal, 40,0 g grassi, 9,5 g grassi saturi, 25,0 g carboidrati, 2,2 g zuccheri, 25,0 g proteine, 0,15 g sale.
1436) Enervit Protein Cream (Fondente): 495 kcal, 35,0 g grassi, 11,0 g grassi saturi, 30,0 g carboidrati, 1,5 g zuccheri, 22,0 g proteine, 0,10 g sale.
1437) Crema Proteica MyProtein (Cioccolato Bianco): 525 kcal, 38,0 g grassi, 9,0 g grassi saturi, 32,0 g carboidrati, 6,5 g zuccheri, 20,0 g proteine, 0,15 g sale.
1438) Grenade Carb Killa Spread (Hazel Nutter): 520 kcal, 38,0 g grassi, 9,0 g grassi saturi, 33,0 g carboidrati, 5,6 g zuccheri, 20,0 g proteine, 0,25 g sale.
1439) Crema spalmabile "Zero" (senza zuccheri aggiunti - generica): 480 kcal, 35,0 g grassi, 8,0 g grassi saturi, 45,0 g carboidrati, 2,0 g zuccheri, 6,0 g proteine, 0,10 g sale.
1441) Burro di Mandorle Pelate (Damiano/Bio): 635 kcal, 56,0 g grassi, 4,5 g grassi saturi, 5,0 g carboidrati, 4,0 g zuccheri, 11,0 g fibre, 23,0 g proteine, 0,01 g sale.
1442) Crema di Anacardi 100%: 590 kcal, 47,0 g grassi, 9,0 g grassi saturi, 22,0 g carboidrati, 5,5 g zuccheri, 3,0 g fibre, 18,0 g proteine, 0,02 g sale.
1443) Crema di Noci 100%: 680 kcal, 65,0 g grassi, 6,0 g grassi saturi, 12,0 g carboidrati, 2,5 g zuccheri, 6,5 g fibre, 15,0 g proteine, 0,01 g sale.
1444) Tahin (Crema di Sesamo Bio - Scuri): 610 kcal, 55,0 g grassi, 8,5 g grassi saturi, 4,0 g carboidrati, 1,0 g zuccheri, 14,0 g fibre, 21,0 g proteine, 0,05 g sale.
1445) Burro di Macadamia 100%: 725 kcal, 75,0 g grassi, 12,0 g grassi saturi, 13,0 g carboidrati, 4,5 g zuccheri, 8,5 g fibre, 8,0 g proteine, 0,01 g sale.
1446) Crema di Pinoli 100%: 675 kcal, 68,0 g grassi, 5,0 g grassi saturi, 13,0 g carboidrati, 3,5 g zuccheri, 3,8 g fibre, 14,0 g proteine, 0,01 g sale.
1448) Crema Galak (NestlÃ© - Cioccolato Bianco): 565 kcal, 35,5 g grassi, 10,5 g grassi saturi, 56,5 g carboidrati, 56,0 g zuccheri, 4,5 g proteine, 0,25 g sale.
1449) Crema Baci Perugina: 545 kcal, 33,0 g grassi, 8,5 g grassi saturi, 52,0 g carboidrati, 50,0 g zuccheri, 7,0 g proteine, 0,10 g sale.
1450) Crema Twix (con biscotto e caramello): 560 kcal, 35,0 g grassi, 9,5 g grassi saturi, 57,0 g carboidrati, 54,0 g zuccheri, 3,0 g proteine, 0,40 g sale.
1451) Crema Bounty (al cocco): 585 kcal, 39,0 g grassi, 15,0 g grassi saturi, 54,0 g carboidrati, 54,0 g zuccheri, 2,5 g proteine, 0,20 g sale.
1452) Maltesers Teasers Spread: 545 kcal, 32,0 g grassi, 10,0 g grassi saturi, 59,0 g carboidrati, 54,0 g zuccheri, 4,0 g proteine, 0,35 g sale.
1453) Venchi Crema Suprema (XV - 0% Olio di Palma): 560 kcal, 37,0 g grassi, 6,5 g grassi saturi, 45,0 g carboidrati, 41,0 g zuccheri, 8,5 g proteine, 0,05 g sale.
1454) Pernigotti Crema Gianduia (Nera): 540 kcal, 34,0 g grassi, 6,0 g grassi saturi, 48,0 g carboidrati, 45,0 g zuccheri, 9,5 g proteine, 0,05 g sale.
1455) Babbi Cremadelizia (Cacao/Nocciola): 545 kcal, 35,0 g grassi, 9,0 g grassi saturi, 50,0 g carboidrati, 48,0 g zuccheri, 8,0 g proteine, 0,10 g sale.
1457) Marshmallow Fluff (Strawberry): 330 kcal, 0 g grassi, 84,0 g carboidrati, 45,0 g zuccheri, 1,0 g proteine, 0,10 g sale.
1458) Cadbury Milk Chocolate Spread: 560 kcal, 35,0 g grassi, 8,5 g grassi saturi, 56,0 g carboidrati, 55,0 g zuccheri, 4,0 g proteine, 0,15 g sale.
1459) Jif Peanut Butter (USA): 595 kcal, 50,0 g grassi, 10,5 g grassi saturi, 22,0 g carboidrati, 10,0 g zuccheri, 23,0 g proteine, 1,30 g sale.
1460) GoÃ»t de Caramel (Crema di caramello salato francese): 430 kcal, 22,0 g grassi, 14,0 g grassi saturi, 58,0 g carboidrati, 55,0 g zuccheri, 1,5 g proteine, 1,10 g sale.
1461) Kaya (Crema di cocco e uova del Sud-Est Asiatico): 320 kcal, 14,0 g grassi, 11,0 g grassi saturi, 45,0 g carboidrati, 40,0 g zuccheri, 4,0 g proteine, 0,15 g sale.
1463) Uovo di quaglia (intero): 158 kcal, 11,0 g grassi, 3,5 g grassi saturi, 0,4 g carboidrati, 0,4 g zuccheri, 0 g fibre, 13,0 g proteine, 0,35 g sale.
1464) Lingue di Gatto (Vicenzi): 460 kcal, 15,0 g grassi, 9,0 g grassi saturi, 72,0 g carboidrati, 38,0 g zuccheri, 1,5 g fibre, 8,5 g proteine, 0,35 g sale
1465) BioSottile (Probios): 410 kcal, 9,5 g grassi, 1,2 g grassi saturi, 72,0 g carboidrati, 18,0 g zuccheri, 5,5 g fibre, 8,5 g proteine, 0,50 g sale
1466) Bresaola della Valtellina IGP (Punta d'Anca): 151 kcal, 2,0 g grassi, 0,7 g grassi saturi, 0,5 g carboidrati, 0,5 g uccheri, 0 g fibre, 32,0 g proteine, 3,80 g sale.
1467) Uova spina: kcal 44, proteine 0.9g, grassi 0.6g, carboidrati 10.0g, fibre 4.3g, micronutrienti: Vitamina C, Manganese
1468) Wurstel (suino): kcal 269, proteine 13.0g, grassi 23.0g, carboidrati 2.0g, fibre 0.0g, micronutrienti: Sodio, Vitamina B1
1469) Zampone di Modena IGP (cotto): 320 kcal, 26,0 g grassi, 9,5 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 0 g fibre, 21,0 g proteine, 2,10 g sale
1472) Pasta di Lenticchie Rosse (confezionati): 335 kcal, 1,7 g grassi, 0,4 g grassi saturi, 50,0 g carboidrati, 1,5 g zuccheri, 11,0 g fibre, 25,0 g proteine, 0,01 g sale.
1476) Chicche di patate (confezionati): 165 kcal, 0,5 g grassi, 0,1 g grassi saturi, 35,0 g carboidrati, 1,0 g zuccheri, 1,5 g fibre, 3,5 g proteine, 1,10 g sale
1477) Scialatielli freschi (confezionati): 265 kcal, 1,5 g grassi, 0,4 g grassi saturi, 54,0 g carboidrati, 1,5 g zuccheri, 2,0 g fibre, 8,0 g proteine, 0,20 g sale.
1481) Pasta al tartufo (confezionata): 360 kcal, 2,0 g grassi, 0,5 g grassi saturi, 70,0 g carboidrati, 3,0 g zuccheri, 3,0 g fibre, 13,5 g proteine, 0,10 g sale
1484) Muesli croccante al cioccolato (confezionati): 470 kcal, 19,0 g grassi, 9,0 g grasi saturi, 61,0 g carboidrati, 25,0 g zuccheri, 7,5 g fibre, 9,0 g proteine, 0,15 g sale.
1486) Riso Arborio/Carnaroli (confezionati): 345 kcal, 0,6 g grassi, 0,1g grassi saturi, 78,0 g carboidrati, 0,3 g zuccheri, 1,0 g fibre, 7,0 g proteine, 0,01 g sale.
1487) Orzo perlato (a crudo) (confezionati): 350 kcal, 1,4 g grassi, 0,3 g grassi saturi, 72,0 g carboidrati, 0,8 g zuccheri, 9,0 g fibre, 10,0 g proteine, 0,01 g sale
1488) Tagliatelle di riso integrale (confezionate): 350 kcal, 2,8 g grassi, 0,6 g grasi saturi, 72,0 g carboidrati, 0,8 g zuccheri, 4,0 g fibre, 7,5 g proteine, 0,05 g sale.
1489) Malto d'Orzo: 315 kcal, 0 g grassi, 77 g carboidrati, 50 g zuccheri, 4 g proteine, 0,15 g sale
1490) Pepe Verde (in salamoia): 85 kcal, 2,0 g grassi,0,5 g grassi saturi, 15,0 g carboidrati, 0,5 g zuccheri, 5,0 g fibre, 2,0 g proteine, 4,50 g sale.
1491) Peperoncino Aleppino (Pul Biber): 320 kcal, 16,0 g grassi, 2,8 g grassi saturi, 48,0 g carboidrati, 9,0 g zuccheri, 22,0 g fibre, 12,0 g proteine, 2,50 g sale (spesso contiene sale aggiunto)
1492) Advieh (mix persiano): 310 kcal, 8,0 g grassi, 1,2 g grassi saturi, 65,0 g carboidrati, 5,0 g zuccheri, 30,0 g fibre, 7,0 g proteine, 0,05 g sale
1493) Mascarpone SL (confezionato): 440 kcal, 46,5 g grassi, 31,5 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 4,2 g proteine, 0,11 g sale.
1494) Yogurt greco 0% grassi (confezionato): 55 kcal, 0 g grassi, 0 g grassi saturi, 3,5 g carboidrati, 3,5 g zuccheri, 0 g fibre, 10,0 g proteine, 0,10 g sal.
1495) Yogurt greco 0% SL (confezionato): 57 kcal, 0 g grassi, 0 g grassi saturi, 4,0 g carboidrati, 4,0 g zuccheri, 0 g fibre, 10,0 g proteine, 0,11 g sale.
1496) Mozzarella di Bufala Campana DOP (confezionaa): 288 kcal, 24,5 g grassi, 17,0 g grassi saturi, 0,7 g carboidrati, 0,7 g zuccheri, 0 g fibre, 16,5 g proteine, 0,60 g sale.
1497) Burro tradizionale (confezionato): 717 kcal, 80,0 g grassi, 52,0 g grassi saturi, 0,6 g carboidrati, 0,6 g zuccheri, 0 g fibre, 0,6 g proteine, 0,02 g sale.
1498) Burro SL (confezionato): 717 kcal, 80,0 g grassi, 52,0 g grassi saturi, 0,7 g carboidrati, 0,7 g zuccheri, 0 g fibre, 0,6 g proteine, 0,02 g sale.
1499) Burro chiarificato (Ghee) (confezionato): 895 kcal, 99,5 g grassi, 65,0 g grassi saturi, 0 g carboidrati, 0 g zuccheri, 0 g fibre, 0 g proteine, 0,01 g sale. (Naturalmente SL)
1500) Burro Light (a ridotto contenuto di grassi) (confezionato): 380 kcal, 40,0 g grassi, 26,0 g grassi saturi, 2,5 g carboidrati, 2,5 g zuccheri, 0 g fibre, 2,0 g proteine, 0,10 g sale.
1501) Yogurt greco alla frutta (confezionato): 110 kcal, 4,0 g grassi, 2,8 g grassi satur 12,0 g carboidrati, 11,0 g zuccheri, 0,5 g fibre, 7,5 g proteine, 0,12 g sale.
1502) Formaggi a Pasta Semidura e Dura (Varianti Regionali e Estere)
1503) Formaggi Freschissimi e Formaggi "a Pasta Cruda"
1504) Yogurt, Latti Fermentati e Dessert (Banco Frigo)
1511) Uovo di gallina alla coque: 143 kcal, 9,5 g grassi, 3,1 g grassi saturi, 0,7 g carboidrati, 0,7 g zuccheri, 0 g fibre, 12,6 g proteine, 0,32 g sale.
1515) Margarina con Fitosteroli: 450 kcal, 50,0 g grassi, 12,0 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 0 g fibre, 0,2 g proteine, 0,45 g sale.
1516) Oli di Semi e Frutta a Guscio
1517) Olio di Canola (Colza): 884 kcal, 100,0 g grassi, 7,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1518) Olio di Neem (tracce): 884 kcal, 100,0 g grassi, 30,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1519) Condimenti Grassi Spray e Infusi
1520) Olio Extravergine Spray (teorico): 820 kcal, 91,0 g grassi, 13,0 g grassi saturi, 0 g carboidrati, 0 g proteine, 0 g sale.
1521) Olio al Peperoncino: 890 kcal, 99,0 g grassi, 14,5 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 0,2 g fibre, 0,1 g proteine, 0,01 g sale.
1522) Olio al Limone: 890 kcal, 99,0 g grassi, 14,5 g grassi saturi, 0,8 g carboidrati, 0,2 g zuccheri, 0 g fibre, 0 g proteine, 0,01 g sale.
1523) Olio al Basilico: 890 kcal, 99,0 g grassi, 14,5 g grassi saturi, 0,5 g carboidrati, 0,1 g zuccheri, 0 g fibre, 0,1 g proteine, 0,01 g sale.
1524) Pane Grattugiato e Panature
1525) Pane grattugiato classico: 350 kcal, 1,5 g grassi, 0,4 g grassi saturi, 70,0 g carboidrati, 3,5 g zuccheri, 4,5 g fibre, 12,0 g proteine, 1,50 g sale.
1526) Panko: 365 kcal, 2,0 g grassi, 0,5 g grassi saturi, 75,0 g carboidrati, 4,0 g zuccheri, 2,5 g fibre, 11,0 g proteine, 1,10 g sale.
1527) Pane grattugiato senza glutine: 360 kcal, 2,2 g grassi, 0,5 g grassi saturi, 78,0 g carboidrati, 2,0 g zuccheri, 2,0 g fibre, 6,5 g proteine, 1,40 g sale.
1528) Pane grattugiato aromatizzato: 355 kcal, 3,5 g grassi, 0,8 g grassi saturi, 68,0 g carboidrati, 3,2 g zuccheri, 4,2 g fibre, 11,5 g proteine, 2,20 g sale.
1529) Pane grattugiato di mais: 370 kcal, 1,2 g grassi, 0,2 g grassi saturi, 80,0 g carboidrati, 1,5 g zuccheri, 3,5 g fibre, 8,0 g proteine, 0,05 g sale.
1530) Farina di Galletta: 380 kcal, 4,0 g grassi, 1,0 g grassi saturi, 72,0 g carboidrati, 5,0 g zuccheri, 3,0 g fibre, 12,0 g proteine, 1,80 g sale.
1531) Pomodoro da insalata: 18 kcal, 0,2 g grassi, 0,0 g grassi saturi, 3,9 g carboidrati, 2,6 g zuccheri, 1,2 g fibre, 0,9 g proteine, 0,01 g sale.
1532) Lattuga Romana: 17 kcal, 0,3 g grassi, 0,0 g grassi saturi, 3,3 g carboidrati, 1,2 g zuccheri, 2,1 g fibre, 1,2 g proteine, 0,02 g sale.
1533) Cavoli e Crocifere Broccolo: 34 kcal, 0,4 g grassi, 0,0 g grassi saturi, 6,6 g carboidrati, 1,7 g zuccheri, 2,6 g fibre, 2,8 g proteine, 0,03 g sale.
1534) Fusti, Bulbi e Tuberi (Patate e affini) Patata comune: 77 kcal, 0,1 g grassi, 0,0 g grassi saturi, 17,5 g carboidrati, 0,8 g zuccheri, 2,2 g fibre, 2,0 g proteine, 0,01 g sale.
1535) Radici, Tuberi e Bulbi Rari Radice di Prezzemolo: 55 kcal, 0,6 g grassi, 0,1 g grassi saturi, 12,0 g carboidrati, 1,5 g zuccheri, 4,3 g fibre, 2,3 g proteine, 0,01 g sale.
1536) Verdure a Foglia e Erbe Alimurgiche (Spontanee) Senape Indiana (foglie): 27 kcal, 0,4 g grassi, 0,0 g grassi saturi, 4,7 g carboidrati, 1,3 g zuccheri, 3,2 g fibre, 2,9 g proteine, 0,02 g sale.
1537) Ortaggi Internazionali e Insoliti Kohlrabi (Cavolo Rapa) Verde: 27 kcal, 0,1 g grassi, 0,0 g grassi saturi, 6,2 g carboidrati, 2,6 g zuccheri, 3,6 g fibre, 1,7 g proteine, 0,02 g sale.
1538) Funghi Shiitake: 34 kcal, 0,5 g grassi, 0,1 g grassi saturi, 6,8 g carboidrati, 2,4 g zuccheri, 2,5 g fibre, 2,2 g proteine, 0,01 g sale.
1539) Funghi Chiodini: 15 kcal, 0,4 g grassi, 0,1 g grassi saturi, 0,5 g carboidrati, 0,2 g zuccheri, 2,1 g fibre, 2,0 g proteine, 0,01 g sale.
1540) Funghi Orecchioni (Pleurotus): 33 kcal, 0,4 g grassi, 0,1 g grassi saturi, 6,0 g carboidrati, 1,1 g zuccheri, 2,3 g fibre, 3,3 g proteine, 0,01 g sale.
1541) Funghi Prataioli: 22 kcal, 0,3 g grassi, 0,1 g grassi saturi, 3,3 g carboidrati, 2,0 g zuccheri, 1,0 g fibre, 3,1 g proteine, 0,01 g sale.
1542) Funghi Pioppini: 20 kcal, 0,4 g grassi, 0,1 g grassi saturi, 1,0 g carboidrati, 0,5 g zuccheri, 2,5 g fibre, 2,5 g proteine, 0,01 g sale.
1543) Funghi Trombetta dei Morti: 15 kcal, 0,3 g grassi, 0,1 g grassi saturi, 0,5 g carboidrati, 0,2 g zuccheri, 4,0 g fibre, 2,0 g proteine, 0,01 g sale.
1544) Funghi Mazza di Tamburo: 25 kcal, 0,4 g grassi, 0,1 g grassi saturi, 2,0 g carboidrati, 0,5 g zuccheri, 3,0 g fibre, 3,0 g proteine, 0,01 g sale.
1545) Funghi Ovuli (freschi): 20 kcal, 0,3 g grassi, 0,1 g grassi saturi, 1,5 g carboidrati, 0,5 g zuccheri, 2,0 g fibre, 2,5 g proteine, 0,01 g sale.
1546) Germogli e Legumi Freschi Germogli di Erba Medica (Alfalfa): 23 kcal, 0,7 g grassi, 0,1 g grassi saturi, 2,1 g carboidrati, 0,2 g zuccheri, 1,9 g fibre, 4,0 g proteine, 0,01 g sale.
1547) Germogli di Ravanello: 43 kcal, 2,5 g grassi, 0,3 g grassi saturi, 3,6 g carboidrati, 1,5 g zuccheri, 1,0 g fibre, 3,8 g proteine, 0,01 g sale.
1548) Germogli di Girasole: 45 kcal, 3,0 g grassi, 0,5 g grassi saturi, 2,5 g carboidrati, 0,5 g zuccheri, 1,0 g fibre, 3,5 g proteine, 0,01 g sale.
1549) Germogli di Lenticchie: 106 kcal, 0,5 g grassi, 0,1 g grassi saturi, 22,0 g carboidrati, 2,0 g zuccheri, 3,5 g fibre, 9,0 g proteine, 0,01 g sale.
1550) Germogli di Piselli: 124 kcal, 0,7 g grassi, 0,1 g grassi saturi, 22,5 g carboidrati, 3,5 g zuccheri, 4,0 g fibre, 8,8 g proteine, 0,01 g sale.
1551) Germogli di Broccolo: 35 kcal, 0,5 g grassi, 0,1 g grassi saturi, 5,0 g carboidrati, 1,5 g zuccheri, 3,0 g fibre, 4,0 g proteine, 0,02 g sale.
1552) Germogli di Cipolla: 30 kcal, 0,2 g grassi, 0,0 g grassi saturi, 6,0 g carboidrati, 3,0 g zuccheri, 2,0 g fibre, 2,0 g proteine, 0,02 g sale.
1553) Lupini deamarizzati (in salamoia): 116 kcal, 2,4 g grassi, 0,3 g grassi saturi, 7,2 g carboidrati, 0,5 g zuccheri, 4,8 g fibre, 16,4 g proteine, 2,50 g sale.
1554) Soia Edamame (bollita): 122 kcal, 5,2 g grassi, 0,6 g grassi saturi, 8,9 g carboidrati, 2,2 g zuccheri, 5,2 g fibre, 11,0 g proteine, 0,01 g sale.
1555) Barbabietole cotte sottovuoto (confezionati): 43 kcal, 0,2 g grassi, 0,0 g grassi saturi, 8,5 g carboidrati, 7,0 g zuccheri, 2,8 g fibre, 1,6 g proteine, 0,15 g sale.
1556) Cetriolini sott'aceto (confezionati): 15 kcal, 0,2 g grassi, 0,0 g grassi saturi, 2,0 g carboidrati, 1,2 g zuccheri, 1,2 g fibre, 0,5 g proteine, 1,80 g sale.

`;

window.datiAlimenti = datiAlimenti;
