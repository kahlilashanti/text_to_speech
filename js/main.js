//init speech synth api
const synth = window.speechSynthesis;

//grab all the DOM elements and assign a variable to them
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

//this section is for the voices api


//init voices array
let voices =[];

const getVoices = () =>{
  voices = synth.getVoices();
  // console.log(voices);

  //loop through voices and create an option for each one
  voices.forEach(voice => {
    // create option elements
    const option = document.createElement('option');

    //fill option with voice and language
    option.textContent = voice.name + '('+ voice.lang +')';

    //set needed option attributes for data name and data lang
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);

    // append options to the select
    voiceSelect.appendChild(option);
  });

};

getVoices();
if(synth.onvoiceschanged !== undefined){
  synth.onvoiceschanged = getVoices;
}

//this section is for the app to speak what the user has typed

const speak = () => {


  //check to make sure it's not already speaking when we click it
  if(synth.speaking){
    console.error('Already speaking...');
    return;
  }

  //check to ensure that text input isn't empty
  if(textInput.value !== ''){

    //add background animation
    body.style.background = '$141414 url(img/wave.gif)'
    body.style.backgroundRepeat = 'repeat-x';
    body.style.backgroundSize = '100% 100%';


    //get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);
    //when it's done speaking...
    speakText.onend = e => {
      console.log('Done speaking...');
      body.style.background = '#141414';
    }

    //speak error
    speakText.onerror = e => {
      console.error('Something went wrong...')
    }

    //which voice to use to speak?
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

    //loop through voices and if the current iteration matches, select that voice

    voices.forEach(voice => {
      if(voice.name === selectedVoice){
        speakText.voice = voice;
      }
    });

    //set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;
    //Speak
    synth.speak(speakText);
  }
};

//set event listeners

//text form submit
textForm.addEventListener('submit', e => {
  e.preventDefault();
  speak();
  textInput.blur();
});

//as we change the rate value, the number should update
rate.addEventListener('change', e => rateValue.textContent = rate.value);

//as we change the pitch value, the number should update
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value);

//as soon as we select a voice we want it to speak with that voice
voiceSelect.addEventListener('change', e => speak());
