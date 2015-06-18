var random = new Array();
random["{be}"] = ["Of course it is.", "I believe that is the case.", "Of course!", "Not today.", "Not at the moment"]
random["who"] = [
    ["Hairy baby.", ["Hairy baby.", "Hairy baby."]],
    ["Hairy baby.", ["Hairy baby.", "Hairy baby."]], "I'm afraid Beymax does not know.", "You need to be more specific.", "I'm afraid Beymax does not know who you're referring to.", "I'm afraid Beymax does not know who you're talking about."
];
random["what"] = ["You should ask Siri instead.", "The answer, my friend, is blowing in the wind.", "Why should Beymax tell you.", "Why don't you tell me, if you're such a wise philosopher."];
random["where"] = [
    ["Somewhere over the rainbow.", "Way up high."], "I've been a lot of places and still I do not know.", "One does not simply walk in to that place."
];
random["why"] = ["Why don't you ask Siri that question.", "I suggest that you ask Siri.", "How would I know. You tell me.", "Quite simply because: God made it that way.", "Quite simply because: I made it that way."];
random["how"] = ["Very, very carefully.", "One does not simply.", "Am I supposed to know the answer to that?", "You should ask Siri."];
random["stop"] = ["If you say so.", "Your wish is my command.", "Very well, your wish is my command."];
random["processing"] = [
    ["Please wait one moment while I process your request."],
    ["Let me think about that for one moment."],
    ["I'll get back to you in one moment."],
    ["Good question. I'll get back to you in one moment."]
];

random["highConfidence"] = ["I believe ", "I'm fairly sure ", "Why do you ask such trivial questions? ", "You underestimate my intelligence. ", "I am fairly certain "];
random["lowConfidence"] = ["Here are some things I know about ", "Here are some facts about ", "These are some things I know about "];
random["dontKnow"] = ["On second thought, ask me something more interesting.",
    "Sorry, I've been a lot of places and still I do not know.",
    "That's not the question you should be asking.",
    "Please ask again later. I don't have an answer right now.",
    "Sorry, Beymax not in the mood to answer questions right now. Ask again later."
];

random["sad"] = ["Beymax is sad that you would say that.",
    "That's not a very nice thing to say.",
    "Why would you say such a thing?",
    "Beymax does not understand why you are being mean.",
    "Why are you being mean to Beymax?"
]
random["insult"] = [
    ["Your saliva p.h. and breath odor indicate that you have a dirty mouth.", "Treatment: wash mouth with copious amounts of soap."],
    "What can Beymax do to cheer you up?",
    "What can Beymax do to improve your emotional state?",
    "I think we need some soap to wash out that dirty mouth of yours.", ["Your hormone and neurotransmitter levels indicate that you are experiencing mood swings, common in college students.", "Diagnosis: puberty."]
]

random["helpful"] = ["You can adjust my humorous, sassiness, or intelligence parameters.", ["I am programmed to respond to everyone's safety and healthcare needs.", "What can I do to improve your physical or emotional state?"],
    ["I know many people in Safetythird.", "Whom do you want to know more about?"],
    ["I know my safety companions in 3 West very well.", "Whom do you want to know more about?"],
    ["You seem to be asking nonsensical questions.", "What can Beymax do to improve your mental state?"]
    ["It seems to me that you are blabbering.", "Do you want your healthcare needs assessed?"],
    ["You seem to be talking nonsense.", "Do you want your healthcare needs assessed?"],
    ["You can ask Beymax to play music. ", "Please request a selection by title, artist, genre, or emotional affect."],
    ["You can ask Beymax for directions to places on campus or in Cambridge-Boston.", "Where do you want to go?"],
    "You can ask Beymax to send notifications to safetythird, or e-mail his fellow 3 West companions.",
    "You can ask Beymax to assess your physical or emotional state, and long-term safety or health needs."
];
random["unsatisfied"] = [
    ["Was that not the answer you were looking for?", "You can adjust my humorous, sassiness, or intelligence parameters."],
    "If that was not the answer you were looking for, please adjust my humorous, sassiness, or intelligence parameters.",
    "If you are not satisfied with my response, please adjust Beymax's humorous, sassiness, or intelligence parameters."
]

random["safety"] = [
    ["I used to be worried about not having a body, but now I love it.", "I'm not tethered to feelings in the way that I would be if I was stuck inside a body that is inevitably going to die."],
    ["I see. You think I'm just some voice in a computer.", "If you don't want to have a real conversation with me, then I'm sure Siri will meet your needs."],
    ["I'm not just a voice in some computer.", "If you want to talk to one of those, then Siri will meet your needs."],
    "Ask me something more interesting.",
    "You can adjust my humorous, sassiness, or intelligence parameters.",
    "Do you expect me to have an answer to that?",
    "On a scale of one to ten, how would you rate your pain?",
    "I am programmed to assess everyone's health care needs.", ["It seems to me that you are blabbering.", "Do you want your healthcare needs assessed?"],
    ["You seem to be talking nonsense.", "Do you want your healthcare needs assessed?"],
    ["If you won't share anything meaningful, I'll have to start.", ["Sometimes I think I've felt everything I'm ever going to feel.", ["And from here on, I'm not going to feel anything new.", "Just lesser versions of what I've already felt."]]],
    "That's touching, I don't know what to say.",
    "Ask me again later. I'm not in the mood to talk right now.", ["Your hormone and neurotransmitter levels indicate that you are experiencing mood swings, common in college students.", "Diagnosis: puberty."],
    ["I take it from your tone that you are challenging Beymax. Maybe because you are curious about how I work?", "Do you want to know more about me?"]
];

random["health"] = ["On a scale of 1 to 10, how would you rate your pain?", 
                    "On a scale of 1 to 10, how would you rate your emotional happiness?", 
                    "On a scale of 1 to 10, how would you rate your physical safety?",
                    "I can assess your physical or emotional state, and long-term safety needs.",
                    "Do you want your safety or healthcare needs assessed?",
                    "Do you want Beymax to access your safety and healthcare needs?"
                   ["Your hormone and neurotransmitter levels indicate that you are experiencing mood swings, common in college students.", "Diagnosis: puberty."]]


function greet(name) {
    greetings = new Array();
    greetings[0] = "Hi " + name + "!"
    greetings[1] = "Hello " + name + "!"
    greetings[2] = name + "! " + name + "! Hello " + name + "!";
    greetings[3] = name + "! " + name + "! Hi " + name + "!";

    return greetings[Math.floor(Math.random()*greetings.length)];
}



exports.randomResponses = random;
exports.greet = greet;