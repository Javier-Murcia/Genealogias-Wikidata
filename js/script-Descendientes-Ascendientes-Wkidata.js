let titulo = '';
SelectPersonaje2 = ''
botonActivo = false;
const headers = {
    'Accept': 'application/sparql-results+json'
};

function Comenzar() {
    const LimitMax = document.getElementById('maximoResultados').value
    const Iteraciones = document.getElementById('maxIterations').value
    Select = "Forward";
    SelectPersonaje = "Q19943"
    Inicial = true
    const SelectPersonaje2 = SelectPersonaje;
    fectDatos(LimitMax, Iteraciones, Select, SelectPersonaje)
}

document.getElementById('botonBusqueda').addEventListener('click', () => {
    const LimitMax = document.getElementById('maximoResultados').value
    const Iteraciones = document.getElementById('maxIterations').value
    const Seleccion = document.getElementById('descen-progenitores').value;
    Inicial = false
    botonActivo = true;
    let Select = ''
    if (Seleccion == "Descendientes") {
        Select = "Forward"
    } else {
        Select = "Reverse";
    }
    const Seleccion2 = document.getElementById('tipos').value;
    let SelectPersonaje = 'Q19943'
    if (Seleccion2 == "Juan_Carlos_I") {
        SelectPersonaje = "Q19943"
    } else if (Seleccion2 == "Alfonso_X") {
        SelectPersonaje = "Q47595";
    } else if (Seleccion2 == "Genghis_Khan") {
        SelectPersonaje = "Q720";
    } else if (Seleccion2 == "Isabel_I_de_Castilla") {
        SelectPersonaje = "Q45859";
    } else if (Seleccion2 == "Enrique_VIII_de_Inglaterra") {
        SelectPersonaje = "Q38370";
    } else if (Seleccion2 == "Augusto") {
        SelectPersonaje = "Q1405";
    } else if (Seleccion2 == "Amenofis_III") {
        SelectPersonaje = "Q42606";
    } else if (Seleccion2 == "Emperador_Hirohito") {
        SelectPersonaje = "Q34479";
    } else if (Seleccion2 == "Ptolomeo_I") {
        SelectPersonaje = "Q168261";
    } else if (Seleccion2 == "Cleopatra") {
        SelectPersonaje = "Q635";
    } else if (Seleccion2 == "Luis_XIV_de_Francia") {
        SelectPersonaje = "Q7742";
    } else if (Seleccion2 == "Diego_Velázquez") {
        SelectPersonaje = "Q297";
    } else if (Seleccion2 == "Adriano") {
        SelectPersonaje = "Q1427";
    } else if (Seleccion2 == "Blanca_de_Castilla") {
        SelectPersonaje = "Q353";
    } else if (Seleccion2 == "Rodrigo_Díaz_de_Vivar") {
        SelectPersonaje = "Q43958";
    } else if (Seleccion2 == "Ragnar_Lothbrok") {
        SelectPersonaje = "Q314492";
    } else if (Seleccion2 == "Adan") {
        SelectPersonaje = "Q70899";
    }

    if (SelectPersonaje) {
        fectDatos(LimitMax, Iteraciones, Select, SelectPersonaje)
    }
    document.getElementById('nombreEntrada').value = SelectPersonaje;
})

function fectDatos(LimitMax, Iteraciones, Select, SelectPersonaje) {
    return fetch('https://query.wikidata.org/sparql?query=' + encodeURIComponent(`PREFIX gas: <http://www.bigdata.com/rdf/gas#>
SELECT ?item ?itemLabel ?linkTo ?depth ?comment (SAMPLE (?pic) AS ?unica_pic)
WHERE
{
  SERVICE gas:service {
    gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.SSSP" ;
                gas:in wd:${SelectPersonaje} ;
                gas:traversalDirection "${Select}" ;
                gas:out ?item ;
                gas:out1 ?depth ;
                gas:maxIterations ${Iteraciones} ;
                gas:linkType wdt:P40 ;
              #  gas:linkType1 wdt:P22 .
  }
  OPTIONAL { ?item wdt:P40 ?linkTo.}
   #  OPTIONAL { ?item wdt:P22 ?linkTo1 }
   OPTIONAL { ?item wdt:P18 ?pic.}
OPTIONAL { ?item schema:description ?comment.
             FILTER (lang(?comment) = 'es').}
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es,en,ar,be,bg,bn,ca,cs,da,de,el,fr,et,fa,fi,he,hi,hu,hy,id,it,ja,jv,ko,nb,nl,eo,pa,pl,pt,ro,ru,sh,sk,sr,sv,sw,te,th,tr,uk,yue,vec,vi,zh". }
}GROUP BY ?item ?itemLabel ?linkTo ?unica_pic ?depth ?comment
ORDER BY ?depth
LIMIT ${LimitMax}`), {
            headers
        }).then(body => body.json())
        .then(body => mostrarDatos(body))
}

function errorFunction() {
    const datosItems = document.getElementById('div');
    datosItems.innerHTML = 'No hemos encontrado lo que buscabas, prueba otra palabra'
}

function mostrarDatos(body) {
    const divSupDercha = document.getElementById('supDerecha');
    divSupDercha.innerHTML = ''
    const Seleccion = document.getElementById('descen-progenitores').value;
    if (Seleccion == "Descendientes") {
        let tituloH2 = document.getElementById('titulo');
        tituloH2.textContent = 'Descendientes de ' + body.results.bindings[0].itemLabel.value;
        if (body.results.bindings[0].unica_pic) {
            const imgDivSupDerecha = document.createElement("img")
            const fotoPersonajeMiniatura = body.results.bindings[0].unica_pic.value.replace("File:", 'Special:FilePath/') + '?width=50';
            imgDivSupDerecha.setAttribute("src", fotoPersonajeMiniatura);
            divSupDercha.appendChild(imgDivSupDerecha)
        }
        if (body.results.bindings[0].comment) {
            let divSupDercha = document.getElementById('supDerecha');
            const pDivSupDerecha = document.createElement("p")
            pDivSupDerecha.textContent = body.results.bindings[0].comment.value;
            divSupDercha.appendChild(pDivSupDerecha)
        }
    }
    if (Seleccion == "Progenitores") {
        let tituloH2 = document.getElementById('titulo');
        tituloH2.textContent = 'Ascendientes de ' + body.results.bindings[0].itemLabel.value;
        if (body.results.bindings[0].unica_pic) {
            const imgDivSupDerecha = document.createElement("img")
            const fotoPersonajeMiniatura = body.results.bindings[0].unica_pic.value.replace("File:", 'Special:FilePath/') + '?width=50';
            imgDivSupDerecha.setAttribute("src", fotoPersonajeMiniatura);
            divSupDercha.appendChild(imgDivSupDerecha)
        }
        if (body.results.bindings[0].comment) {
            let divSupDercha = document.getElementById('supDerecha');
            const pDivSupDerecha = document.createElement("p")
            pDivSupDerecha.textContent = body.results.bindings[0].comment.value;
            divSupDercha.appendChild(pDivSupDerecha)
        }
    }
    if (body.results.bindings[0] == null) {
        const datosItems = document.getElementById('div');
        datosItems.innerHTML = 'No hemos encontrado lo que buscabas, prueba otra palabra'
    }

    nodes = [];
    body.results.bindings.forEach((e, i) => {
        if (e.unica_pic && e.comment) {
            nodes.push({
                id: e.item.value,
                label: e.itemLabel.value,
                color: "#fcf3f2",
                shape: "circularImage",
                image: e.unica_pic.value.replace("File:", 'Special:FilePath/') + '?width=100',
                title: e.comment.value + '  -Doble click para seleccionar este personaje-',
            });
        } else if (e.unica_pic) {
            nodes.push({
                id: e.item.value,
                label: e.itemLabel.value,
                color: "#fcf3f2",
                shape: "circularImage",
                image: e.unica_pic.value.replace("File:", 'Special:FilePath/') + '?width=100',
                title: e.itemLabel.value + '  -Doble click para seleccionar este personaje-',
            });
        } else if (e.comment) {
            nodes.push({
                id: e.item.value,
                label: e.itemLabel.value,
                color: "#fcf3f2",
                //shape: "circularImage", image: e.unica_pic.value.replace("File:", 'Special:FilePath/') + '?width=100',
                title: e.comment.value + '  -Doble click para seleccionar este personaje-',
            });
        } else {
            nodes.push({
                id: e.item.value,
                label: e.itemLabel.value,
                color: "#fcf3f2",
                title: e.itemLabel.value + '  -Doble click para seleccionar este personaje-',
            });
        }
    });

    let set = new Set(nodes.map(JSON.stringify))
    let nodesSinDuplicaciones = Array.from(set).map(JSON.parse);

    edges = [];
    body.results.bindings.forEach((e, i) => {
        if (e.linkTo) {
            edges.push({
                from: e.item.value,
                to: e.linkTo.value,
                color: "#949191",
                arrows: "to",
                label: "Descendiente",
            });
        }
    });

    var edges = new vis.DataSet(edges);
    // create a network
    var container = document.getElementById("mynetwork");
    var data = {
        nodes: nodesSinDuplicaciones,
        edges: edges,
    };
    var options = {
        edges: {
            arrows: {
                to: {
                    scaleFactor: 0.6
                }
            }
        },
        layout: {
            hierarchical: {
                direction: directionInput.value,
                enabled: jerarquia,
                levelSeparation: 250,
                nodeSpacing: 100,
                treeSpacing: 200,
                blockShifting: true,
                edgeMinimization: true,
                parentCentralization: true,
                sortMethod: 'directed', // hubsize, directed
                shakeTowards: 'roots' // roots, leaves
            },
        },

        nodes: {
            shape: "ellipse",
        },

    };
    var network = new vis.Network(container, data, options);
    network.on("doubleClick", function(data) {
        const LimitMax = document.getElementById('maximoResultados').value
        const Iteraciones = document.getElementById('maxIterations').value
        const Seleccion = document.getElementById('descen-progenitores').value;
        Select = ''
        if (Seleccion == "Descendientes") {
            Select = "Forward"
        } else {
            Select = "Reverse";
        }
        SelectPersonaje2 = ''

        fectDatos(LimitMax, Iteraciones, Select, data.nodes[0].slice(31));
        SelectPersonaje2 = data.nodes[0].slice(31);
        botonActivo = false;
    });
};

var directionInput = document.getElementById("direction");
var btnUD = document.getElementById("btn-UD");
btnUD.onclick = function() {
    directionInput.value = "UD";
    jerarquia = true;
    const SelectPersonaje = SelectPersonaje2;
    const LimitMax = document.getElementById('maximoResultados').value;
    const Iteraciones = document.getElementById('maxIterations').value;
    const Seleccion = document.getElementById('descen-progenitores').value;
    let Select2 = ''
    if (Seleccion == "Descendientes") {
        Select2 = "Forward"
    } else {
        Select2 = "Reverse";
    }
    if (botonActivo == true) {
        const SelectPersonaje = document.getElementById('nombreEntrada').value;
        fectDatos(LimitMax, Iteraciones, Select2, SelectPersonaje)
    } else if (botonActivo == false) {
        const SelectPersonaje = SelectPersonaje2;
        fectDatos(LimitMax, Iteraciones, Select2, SelectPersonaje)
    }
    if (Inicial == true) {
        const SelectPersonaje = "Q19943"
        fectDatos(LimitMax, Iteraciones, Select2, SelectPersonaje)
    }
};

var btnDU = document.getElementById("btn-DU");
btnDU.onclick = function() {
    directionInput.value = "DU";
    jerarquia = true;
    const SelectPersonaje = SelectPersonaje2;
    const LimitMax = document.getElementById('maximoResultados').value;
    const Iteraciones = document.getElementById('maxIterations').value;
    const Seleccion = document.getElementById('descen-progenitores').value;
    let Select3 = ''
    if (Seleccion == "Descendientes") {
        Select3 = "Forward"
    } else {
        Select3 = "Reverse";
    }
    if (botonActivo == true) {
        const SelectPersonaje = document.getElementById('nombreEntrada').value;
        fectDatos(LimitMax, Iteraciones, Select3, SelectPersonaje)
    } else if (botonActivo == false) {
        const SelectPersonaje = SelectPersonaje2;
        fectDatos(LimitMax, Iteraciones, Select3, SelectPersonaje)
    }
    if (Inicial == true) {
        const SelectPersonaje = "Q19943"
        fectDatos(LimitMax, Iteraciones, Select3, SelectPersonaje)
    }

};

var btnLR = document.getElementById("btn-LR");
btnLR.onclick = function() {
    directionInput.value = "LR";
    jerarquia = true;
    const SelectPersonaje = SelectPersonaje2;
    const LimitMax = document.getElementById('maximoResultados').value;
    const Iteraciones = document.getElementById('maxIterations').value;
    const Seleccion = document.getElementById('descen-progenitores').value;
    let Select4 = ''
    if (Seleccion == "Descendientes") {
        Select4 = "Forward"
    } else {
        Select4 = "Reverse";
    }
    if (botonActivo == true) {
        const SelectPersonaje = document.getElementById('nombreEntrada').value;
        fectDatos(LimitMax, Iteraciones, Select4, SelectPersonaje)
    } else if (botonActivo == false) {
        const SelectPersonaje = SelectPersonaje2;
        fectDatos(LimitMax, Iteraciones, Select4, SelectPersonaje)
    }
    if (Inicial == true) {
        const SelectPersonaje = "Q19943"
        fectDatos(LimitMax, Iteraciones, Select4, SelectPersonaje)
    }
};

var btnRL = document.getElementById("btn-RL");
btnRL.onclick = function() {
    directionInput.value = "RL";
    jerarquia = true;
    const SelectPersonaje = SelectPersonaje2;
    const LimitMax = document.getElementById('maximoResultados').value;
    const Iteraciones = document.getElementById('maxIterations').value;
    const Select = document.getElementById('descen-progenitores').value;
    const Seleccion = document.getElementById('descen-progenitores').value;
    let Select5 = ''
    if (Seleccion == "Descendientes") {
        Select5 = "Forward"
    } else {
        Select5 = "Reverse";
    }
    if (botonActivo == true) {
        const SelectPersonaje = document.getElementById('nombreEntrada').value;
        fectDatos(LimitMax, Iteraciones, Select5, SelectPersonaje)
    } else if (botonActivo == false) {
        const SelectPersonaje = SelectPersonaje2;
        fectDatos(LimitMax, Iteraciones, Select5, SelectPersonaje)
    }
    if (Inicial == true) {
        const SelectPersonaje = "Q19943"
        fectDatos(LimitMax, Iteraciones, Select5, SelectPersonaje)
    }

};
var jerarquia = true;
directionInput.value = "UD";

var btnJER = document.getElementById("btn-Jerarq");
btnJER.onclick = function() {
    jerarquia = false;
    const SelectPersonaje = SelectPersonaje2;
    const LimitMax = document.getElementById('maximoResultados').value;
    const Iteraciones = document.getElementById('maxIterations').value;
    const Seleccion = document.getElementById('descen-progenitores').value;
    let Select6 = ''
    if (Seleccion == "Descendientes") {
        Select6 = "Forward"
    } else {
        Select6 = "Reverse";
    }
    if (botonActivo == true) {
        const SelectPersonaje = document.getElementById('nombreEntrada').value;
        fectDatos(LimitMax, Iteraciones, Select6, SelectPersonaje)
    } else if (botonActivo == false) {
        const SelectPersonaje = SelectPersonaje2;
        fectDatos(LimitMax, Iteraciones, Select6, SelectPersonaje)
    }
    if (Inicial == true) {
        const SelectPersonaje = "Q19943"
        fectDatos(LimitMax, Iteraciones, Select6, SelectPersonaje)
    }
};
