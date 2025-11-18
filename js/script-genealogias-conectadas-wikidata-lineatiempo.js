jerarquia = false;
const headers = {
    'Accept': 'application/sparql-results+json'
};


function Comenzar() {
    Iteraciones = '35';
    SelectPersonaje = "Q47595";
    SelectPersonaje2 = "Q19943";
    const datosItems = document.getElementById('supDerecha');
    datosItems.innerHTML = '¡Estamos buscando!'
    fectDatos(Iteraciones, SelectPersonaje, SelectPersonaje2)
}

document.getElementById('botonBusqueda').addEventListener('click', () => {
    const Iteraciones = document.getElementById('maxIterations').value

    const datosItems = document.getElementById('supDerecha');
    datosItems.innerHTML = '¡Estamos buscando!'



    const Seleccion2 = document.getElementById('tipos').value;
    let SelectPersonaje = ''
    if (Seleccion2 == "Juan_Carlos_I") {
        SelectPersonaje = "Q19943"
    } else if (Seleccion2 == "Alfonso_X") {
        SelectPersonaje = "Q47595";
    } else if (Seleccion2 == "Isabel_I_de_Castilla") {
        SelectPersonaje = "Q45859";
    } else if (Seleccion2 == "Enrique_VIII_de_Inglaterra") {
        SelectPersonaje = "Q38370";
    } else if (Seleccion2 == "Ptolomeo_I") {
        SelectPersonaje = "Q168261";
    } else if (Seleccion2 == "Luis_XIV_de_Francia") {
        SelectPersonaje = "Q7742";
    } else if (Seleccion2 == "Carlomagno") {
        SelectPersonaje = "Q3044";
    } else if (Seleccion2 == "Gosuinda") {
        SelectPersonaje = "Q1274582";
    } else if (Seleccion2 == "Nicolás_II_de_rusia") {
        SelectPersonaje = "Q40787";
    } else if (Seleccion2 == "Isabel_I_de_Inglaterra") {
        SelectPersonaje = "Q7207";
    } else if (Seleccion2 == "Adriano") {
        SelectPersonaje = "Q1427";
    } else if (Seleccion2 == "Ragnar_Lothbrok") {
        SelectPersonaje = "Q314492";
    }


    const Seleccion3 = document.getElementById('tipos2').value;
    let SelectPersonaje2 = ''
    if (Seleccion3 == "Juan_Carlos_I") {
        SelectPersonaje2 = "Q19943"
    } else if (Seleccion3 == "Alfonso_X") {
        SelectPersonaje2 = "Q47595";
    } else if (Seleccion3 == "Isabel_I_de_Castilla") {
        SelectPersonaje2 = "Q45859";
    } else if (Seleccion3 == "Enrique_VIII_de_Inglaterra") {
        SelectPersonaje2 = "Q38370";
    } else if (Seleccion3 == "Luis_XIV_de_Francia") {
        SelectPersonaje2 = "Q7742";
    } else if (Seleccion3 == "Carlomagno") {
        SelectPersonaje2 = "Q3044";
    } else if (Seleccion3 == "Gosuinda") {
        SelectPersonaje2 = "Q1274582";
    } else if (Seleccion3 == "Nicolás_II_de_rusia") {
        SelectPersonaje2 = "Q40787";
    } else if (Seleccion3 == "Isabel_I_de_Inglaterra") {
        SelectPersonaje2 = "Q7207";
    } else if (Seleccion3 == "Ragnar_Lothbrok") {
        SelectPersonaje2 = "Q314492";
    }


    if (SelectPersonaje && SelectPersonaje2) {
        fectDatos(Iteraciones, SelectPersonaje, SelectPersonaje2)
    }
    document.getElementById('nombreEntrada').value = SelectPersonaje;
    document.getElementById('nombreEntrada2').value = SelectPersonaje2;
})



function fectDatos(Iteraciones, SelectPersonaje, SelectPersonaje2) {

    return fetch('https://query.wikidata.org/sparql?query=' + encodeURIComponent(`PREFIX gas: <http://www.bigdata.com/rdf/gas#>

    SELECT ?item ?itemLabel ?linkTo ?comment  (SAMPLE (?EjemfechaNaci) AS ?fechaNaci) (SAMPLE (?Ejemfechafalle) AS ?fechafalle) (SAMPLE (?pic) AS ?unica_pic)
    WHERE
    {
      SERVICE gas:service {
        gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.SSSP" ;
                    gas:in  wd:${SelectPersonaje} ;
                    gas:traversalDirection "Forward" ;
                    gas:target wd:${SelectPersonaje2} ;
                    gas:out ?item ;
                    gas:out1 ?depth ;
                    gas:maxIterations ${Iteraciones} ;
                    gas:linkType wdt:P40 ;

      }
      OPTIONAL { ?item wdt:P40 ?linkTo}
       OPTIONAL { ?item wdt:P18 ?pic}
         OPTIONAL { ?item wdt:P569 ?EjemfechaNaci }
      OPTIONAL { ?item wdt:P570 ?Ejemfechafalle }
    OPTIONAL { ?item schema:description ?comment.
                 FILTER (lang(?comment) = 'es').}
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es,en,ar,be,bg,bn,ca,cs,da,de,el,fr,et,fa,fi,he,hi,hu,hy,id,it,ja,jv,ko,nb,nl,eo,pa,pl,pt,ro,ru,sh,sk,sr,sv,sw,te,th,tr,uk,yue,vec,vi,zh". }

    }GROUP BY ?item ?itemLabel ?linkTo ?unica_pic ?comment ?fechaNaci ?fechaFalle`), {
            headers
        }).then(body => body.json())

        .then(body => mostrarDatos(body))

        .catch(function(error) {
            errorFunction();
        });
}

function errorFunction() {
    const datosItems = document.getElementById('supDerecha');
    datosItems.innerHTML = 'No hemos encontrado lo que buscabas, prueba con otra selección'
}



function mostrarDatos(body) {
    const datosItems = document.getElementById('supDerecha');
    datosItems.innerHTML = ''
    const timelineItems = document.getElementById('timeline');
    timelineItems.innerHTML = ''

    if (body.results.bindings[0] == null) {
        const datosItems = document.getElementById('supDerecha');
        datosItems.innerHTML = 'No hemos encontrado lo que buscabas, prueba con otra selección'

    }

    let tituloH2 = document.getElementById('titulo');
    const tituloPersonaje2 = document.getElementById('tipos2').value.replaceAll("_", ' ');
    const tituloPersonaje1 = document.getElementById('tipos').value.replaceAll("_", ' ');

    if (tituloPersonaje2.substring(0, 1) == 'I') {
        tituloH2.textContent = 'El camino más corto entre ' + tituloPersonaje1 + ' e ' + tituloPersonaje2;
    } else {
        tituloH2.textContent = 'El camino más corto entre ' + tituloPersonaje1 + ' y ' + tituloPersonaje2;
    }

    nodes = [];

    function parseDate(dateTime) {
        // Add leading plus sign if it's missing
        dateTime = dateTime.replace(/^(?![+-])/, '+');
        // Pad years to 6 digits
        dateTime = dateTime.replace(/^([+-]?)(\d{1,5}\b)/, function($0, $1, $2) {
            return $1 + ('00000' + $2).slice(-6);
        });
        // Remove timezone
        dateTime = dateTime.replace(/Z$/, '');

        return dateTime;

    };

    body.results.bindings.forEach((e, i) => {
        if (e.unica_pic && e.comment) {
            nodes.push({
                id: e.item.value,
                label: e.itemLabel.value,
                color: "#fcf3f2",
                shape: "circularImage",
                image: e.unica_pic.value.replace("File:", 'Special:FilePath/') + '?width=100',
                title: e.comment.value,
            });
        } else if (e.unica_pic) {
            nodes.push({
                id: e.item.value,
                label: e.itemLabel.value,
                color: "#fcf3f2",
                shape: "circularImage",
                image: e.unica_pic.value.replace("File:", 'Special:FilePath/') + '?width=100',
                title: e.itemLabel.value,
            });
        } else if (e.comment) {
            nodes.push({
                id: e.item.value,
                label: e.itemLabel.value,
                color: "#fcf3f2",

                title: e.comment.value,
            });
        } else {
            nodes.push({
                id: e.item.value,
                label: e.itemLabel.value,
                color: "#fcf3f2",
                title: e.itemLabel.value,
            });
        }


    });


    //eliminar elementos repetidos en el objeto
    let set = new Set(nodes.map(JSON.stringify))
    let nodesSinDuplicaciones = Array.from(set).map(JSON.parse);

    console.log(nodesSinDuplicaciones);

    edges = [];
    body.results.bindings.forEach((e, i) => {
        if (e.linkTo) {
            edges.push({
                from: e.item.value,
                to: e.linkTo.value,
                color: "#949191",
                arrows: "to",

            });
        }
    });

    // create an array with edges
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
                shakeTowards: 'leaves' // roots, leaves
            },
        },

        nodes: {
            shape: "ellipse",
        },

    };

    var network = new vis.Network(container, data, options);
    network.on("doubleClick", function(data) {
        window.open(data.nodes[0], '_blank');
    });

    items2 = [];


    body.results.bindings.forEach((e, i) => {

        if (e.fechaNaci && e.fechaNaci.value.slice(0, 4) === "http") {

        } else if (e.unica_pic && e.fechaNaci) {

            items2.push({
                id: e.item.value,
                content: e.itemLabel.value + '</br><img src="' + e.unica_pic.value.replace("File:", 'Special:FilePath/') + '?width=50' + '"/></br>' + e.fechaNaci.value.slice(0, 4).replace(/[^0-9]$/, ""),
                start: parseDate(e.fechaNaci.value),
            });
        } else if (e.fechaNaci) {

            items2.push({
                id: e.item.value,
                content: e.itemLabel.value + '</br>' + e.fechaNaci.value.slice(0, 4).replace(/[^0-9]$/, ""),
                start: parseDate(e.fechaNaci.value),
            });
        }
    });

    //eliminar elementos repetidos en el objeto
    let set2 = new Set(items2.map(JSON.stringify))
    let nodesSinDuplicaciones2 = Array.from(set2).map(JSON.parse);

    var options = {

        minHeight: '400px',
        maxHeight: '500px',
        orientation: {
            axis: 'both',
            item: 'top'
        },
        align: 'auto',
        stack: true,

    };


    montar(nodesSinDuplicaciones2, options)

};

function montar(nodesSinDuplicaciones2, options) {

    var container = document.getElementById("timeline");
    var timeline = new vis.Timeline(container, nodesSinDuplicaciones2, options);
};

var directionInput = document.getElementById("direction");
var btnUD = document.getElementById("btn-UD");
btnUD.onclick = function() {
    jerarquia = true;
    directionInput.value = "UD";

    const SelectPersonaje = document.getElementById('nombreEntrada').value;
    const SelectPersonaje2 = document.getElementById('nombreEntrada2').value;
    const Iteraciones = document.getElementById('maxIterations').value;

    if (SelectPersonaje && SelectPersonaje2) {
        fectDatos(Iteraciones, SelectPersonaje, SelectPersonaje2)
    }

};



var btnDU = document.getElementById("btn-DU");
btnDU.onclick = function() {
    directionInput.value = "DU";
    jerarquia = true;
    const SelectPersonaje = document.getElementById('nombreEntrada').value;
    const SelectPersonaje2 = document.getElementById('nombreEntrada2').value;
    const Iteraciones = document.getElementById('maxIterations').value;

    if (SelectPersonaje && SelectPersonaje2) {
        fectDatos(Iteraciones, SelectPersonaje, SelectPersonaje2)
    }
};

const enfermedadActiva = ''

var btnLR = document.getElementById("btn-LR");
btnLR.onclick = function() {
    directionInput.value = "LR";
    jerarquia = true;
    const SelectPersonaje = document.getElementById('nombreEntrada').value;
    const SelectPersonaje2 = document.getElementById('nombreEntrada2').value;
    const Iteraciones = document.getElementById('maxIterations').value;

    if (SelectPersonaje && SelectPersonaje2) {
        fectDatos(Iteraciones, SelectPersonaje, SelectPersonaje2)
    }
};
var btnRL = document.getElementById("btn-RL");
btnRL.onclick = function() {
    directionInput.value = "RL";
    jerarquia = true;
    const SelectPersonaje = document.getElementById('nombreEntrada').value;
    const SelectPersonaje2 = document.getElementById('nombreEntrada2').value;
    const Iteraciones = document.getElementById('maxIterations').value;

    if (SelectPersonaje && SelectPersonaje2) {
        fectDatos(Iteraciones, SelectPersonaje, SelectPersonaje2)
    }
};

var btnJER = document.getElementById("btn-Jerarq");
btnJER.onclick = function() {
    jerarquia = false;

    const SelectPersonaje = document.getElementById('nombreEntrada').value;
    const SelectPersonaje2 = document.getElementById('nombreEntrada2').value;
    const Iteraciones = document.getElementById('maxIterations').value;

    if (SelectPersonaje && SelectPersonaje2) {
        fectDatos(Iteraciones, SelectPersonaje, SelectPersonaje2)
    }

};
