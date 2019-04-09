// Create trtl button styles
var trtlButtonStyle = document.createElement("style");
trtlButtonStyle.innerHTML = `    /* The Modal (background) */
    .trtlButtonModal {
        display: none;
        /* Hidden by default */
        position: fixed;
        /* Stay in place */
        z-index: 1;
        /* Sit on top */
        padding-top: 100px;
        /* Location of the box */
        left: 0;
        top: 0;
        width: 100%;
        /* Full width */
        height: 100%;
        /* Full height */
        overflow: auto;
        /* Enable scroll if needed */
        background-color: rgb(0, 0, 0);
        /* Fallback color */
        background-color: rgba(0, 0, 0, 0.4);
        /* Black w/ opacity */
    }

    /* Modal Content */
    .trtlButtonModalContent {
        background-color: #fefefe;
        margin: auto;
        height: auto;
        padding: 20px;
        border: 1px solid #888;
        width: 45%;
    }

    /* The Close Button */
    .trtlButtonModalClose {
        color: #aaaaaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }

    .trtlButtonModalClose:hover,
    .trtlButtonModalClose:focus {
        color: #000;
        text-decoration: none;
        cursor: pointer;
    }

  /* styling for the created button */
    #trtlButton {
        border-radius: 4px;
    color: white;
    background-color: #38c172;
    padding: 0.7rem 2rem;
    font-size: 1.2rem;
    cursor:  pointer;

    }

    #trtlButton:hover {
      background-color: #51d88a;
    }

    #trtlButton:focus {
      outline: none;
    }
  #trtlButtonIframe {
    width:100%;
    border:0;
      }

    @media only screen and (max-width: 600px) {
  .turtlePayButtonModalContent {
    width: 95%;
  }
    }`;

// // Get the first script tag
var trtlButtonref = document.querySelector("script");

// // Insert our new styles before the first script tag
trtlButtonref.parentNode.insertBefore(trtlButtonStyle, trtlButtonref);

// creates the modal for the turtlecoin button pop up
var trtlButtonModalCode = `<div id="trtlButtonModal" class="trtlButtonModal">
    <!-- Modal content -->
    <div class="trtlButtonModalContent rounded">
        <span class="trtlButtonModalClose">&times;</span>
        <div>
            <div class="" style="margin-top:1.5rem">
                <iframe src="" height="520px" id="trtlButtonIframe"></iframe>
            </div>
        </div>
    </div>
  </div>`;

var trtlDiv = document.createElement("div");

trtlDiv.innerHTML = trtlButtonModalCode;
console.log(trtlDiv);
document.body.appendChild(trtlDiv);

var trtlButtonModal = document.getElementById("trtlButtonModal");

// creates the button for the turtleCoin pay widget
var trtlButton = document.createElement("input");
trtlButton.type = "button";
trtlButton.value = "Pay with TRTL";
trtlButton.id = "trtlButton";
trtlButton.onclick = function() {
  trtlButtonModal.style.display = "block";
};

// Get the <span> element that closes the modal
var trtlButtonModalClose = document.getElementsByClassName(
  "trtlButtonModalClose"
)[0];

// When the user clicks on <span> (x), close the modal
trtlButtonModalClose.onclick = function() {
  trtlButtonModal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == trtlButtonModal) {
    trtlButtonModal.style.display = "none";
  }
};

document.querySelector(".trtl-btn").appendChild(trtlButton);

// populate the iframe url with your hashed data from TurtlePay
trtlButtonIframe = document.querySelector("#trtlButtonIframe");
trtlButtonDiv = document.querySelector(".trtl-btn");

// trtlButtonData = trtlButtonIframe.getAttribute("data-turtle");
const trtlButtonPayload = trtlButtonDiv.getAttribute("data-trtlbutton");

trtlButtonIframe.src = `https://trtlbutton.com/pay?buttonPayload=${trtlButtonPayload}`;
