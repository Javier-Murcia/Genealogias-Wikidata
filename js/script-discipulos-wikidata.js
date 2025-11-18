let titulo = '';
SelectPersonaje2 = ''
LimitMax = 200
Iteraciones = 15
botonActivo = false;
const Seleccion = document.getElementById('descen-progenitores').value;
Select = ''
if (Seleccion == "Descendientes") {
    Select = "Forward"
} else {
    Select = "Reverse";
}
const headers = {
    'Accept': 'application/sparql-results+json'
};

function Comenzar() {
    const LimitMax = document.getElementById('maximoResultados').value
    const Iteraciones = document.getElementById('maxIterations').value
    Select = "Forward"
    SelectPersonaje = "Q762"
    Inicial = true
    fectDatos(LimitMax, Iteraciones, Select, SelectPersonaje)
}

document.getElementById('botonBusqueda').addEventListener('click', () => {
    const LimitMax = document.getElementById('maximoResultados').value
    const Iteraciones = document.getElementById('maxIterations').value
    const Seleccion = document.getElementById('descen-progenitores').value;
    const datosItems = document.getElementById('supDerecha');
    datosItems.innerHTML = '¡Estamos buscando!'
    let Select = ''
    Inicial = false
    botonActivo = true;
    if (Seleccion == "Descendientes") {
        Select = "Forward"
    } else {
        Select = "Reverse";
    }
    const Seleccion2 = document.getElementById('tipos').value;
    let SelectPersonaje = SelectPersonaje2
    //SelectPersonaje2
    if (Seleccion2 == "Leonardo_da_Vinci") {
        SelectPersonaje = "Q762"
    } else if (Seleccion2 == "Aristóteles") {
        SelectPersonaje = "Q868";
    } else if (Seleccion2 == "Nicolás_Copérnico") {
        SelectPersonaje = "Q619";
    } else if (Seleccion2 == "Juan_Argirópulo") {
        SelectPersonaje = "Q26648";
    } else if (Seleccion2 == "Jean_Auguste_Dominique_Ingres") {
        SelectPersonaje = "Q23380";
    } else {
        SelectPersonaje = SelectPersonaje2;
    }
    if (SelectPersonaje) {
        fectDatos(LimitMax, Iteraciones, Select, SelectPersonaje)
    }
    document.getElementById('nombreEntrada').value = SelectPersonaje;
})

function fectDatos(LimitMax, Iteraciones, Select, SelectPersonaje) {
    return fetch('https://query.wikidata.org/sparql?query=' + encodeURIComponent(`PREFIX gas: <http://www.bigdata.com/rdf/gas#>
SELECT ?item ?itemLabel ?linkTo ?depth ?comment (SAMPLE (?EjemfechaNaci) AS ?fechaNaci) (SAMPLE (?pic) AS ?unica_pic)
WHERE
{
  SERVICE gas:service {
    gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.SSSP" ;
                gas:in wd:${SelectPersonaje} ;
                gas:traversalDirection "${Select}" ;
                gas:out ?item ;
                gas:out1 ?depth ;
                gas:maxIterations ${Iteraciones} ;
                gas:linkType wdt:P802 ;
              #  gas:linkType1 wdt:P22 .
  }
  OPTIONAL { ?item wdt:P802 ?linkTo.}
   #  OPTIONAL { ?item wdt:P22 ?linkTo1 }
   OPTIONAL { ?item wdt:P18 ?pic.}
OPTIONAL { ?item wdt:P569 ?EjemfechaNaci }
OPTIONAL { ?item schema:description ?comment.
             FILTER (lang(?comment) = 'es').}
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es,en,ca,ms,be,ar,bg,bn,cs,da,de,el,fr,et,fa,fi,he,hi,hu,hy,id,it,ja,jv,ko,nb,nl,eo,pa,pl,pt,ro,ru,sh,sk,sr,sv,sw,te,th,tr,uk,yue,vec,vi,zh". }
}GROUP BY ?item ?itemLabel ?linkTo ?unica_pic ?depth ?comment ?fechaNaci
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
    const datosItems = document.getElementById('supDerecha');
    datosItems.innerHTML = ''
    const timelineItems = document.getElementById('timeline');
    timelineItems.innerHTML = ''
    if (body.results.bindings[0] == null) {
        const datosItems = document.getElementById('div');
        datosItems.innerHTML = 'No hemos encontrado lo que buscabas, prueba otra palabra'
    }
    const Seleccion = document.getElementById('descen-progenitores').value;
    if (Seleccion == "Descendientes") {
        let tituloH2 = document.getElementById('titulo');
        tituloH2.textContent = 'Discípulos de ' + body.results.bindings[0].itemLabel.value;
    }
    if (Seleccion == "Progenitores") {
        let tituloH2 = document.getElementById('titulo');
        tituloH2.textContent = 'Maestros de ' + body.results.bindings[0].itemLabel.value;
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


    //eliminar elementos repetidos en el objeto
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
                label: "Discípulo",
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
        const Seleccion = document.getElementById('descen-progenitores').value;
        const LimitMax = document.getElementById('maximoResultados').value
        const Iteraciones = document.getElementById('maxIterations').value
        Select = ''
        Inicial = false

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


    items2 = [];


    body.results.bindings.forEach((e, i) => {

        if (e.fechaNaci && e.fechaNaci.value.slice(0, 4) === "http") {

        } else if (e.unica_pic && e.fechaNaci) {

            items2.push({
                id: e.item.value,
                content: e.itemLabel.value + '</br><img src="' + e.unica_pic.value.replace("File:", 'Special:FilePath/') + '?width=50' + '"/></br>' + e.fechaNaci.value.slice(0, 5).replace(/[^0-9]$/, ""),
                start: parseDate(e.fechaNaci.value),
            });
        } else if (e.fechaNaci) {

            items2.push({
                id: e.item.value,
                content: e.itemLabel.value + '</br>' + e.fechaNaci.value.slice(0, 5).replace(/[^0-9]$/, ""),
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
    directionInput.value = "UD";

    jerarquia = true;
    const SelectPersonaje = SelectPersonaje2;
    //const SelectPersonaje = document.getElementById('nombreEntrada').value ;
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
        const SelectPersonaje = "Q762"
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
        const SelectPersonaje = "Q762"
        fectDatos(LimitMax, Iteraciones, Select3, SelectPersonaje)
    }
};

const enfermedadActiva = ''

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
        const SelectPersonaje = "Q762"
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
        const SelectPersonaje = "Q762"
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
        const SelectPersonaje = "Q762"
        fectDatos(LimitMax, Iteraciones, Select6, SelectPersonaje)
    }

};
