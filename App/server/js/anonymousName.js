let animals = 
[
    "bird", "lion", "elephant", "leopard", "snow leopard", "turtle", "shark", "blue whale", "rhinoceros", "polar bear", "black bear", "humpback whale", "emperor penguin", "penguin", "african elephant", "whale shark", "red wolf", "grass snake",
    "chimpanzee", "tiger", "green turtle", "grey wolf", "basking shark", "red panda", "american alligator", "cheetah", "bald eagle", "aye-aye", "orca", "asian elephant", "royal penguin", "house spider", "komodo dragon", "bonobo",
    "bottlenode dolphin", "african wild dog", "puma", "red fox", "sperm whale", "jaguar", "chinese giant salamander", "alligator snapping turtle", "barn owl", "orangutan", "giraffe", "western gorilla", "koala", "moose", "ring-tailed lemur", "giant armadillo",
    "brown hyaena", "coyote", "zebra", "sloth", "red panda", "wolverine", "black flying fox", "fishing cat", "african grey parrot", "kakapo", "andean flamingo", "japanese crane", "puffin", "ostrich", "great spotted kiwi", "viper", "black caiman",
    "iguana", "chameleon", "lizard", "king cobra", "gecko", "salamander", "frog", "toad", "seadragon", "queen triggerfish", "bluefin tuna", "frilled shark", "eel", "parrotfish", "manta ray", "pike", "great hammerhead", "salmon", "seahorse",
    "swordfish", "beluga", "blacktip reef shark", "butterfly", "grasshopper", "snail", "ant", "honey bee", "bumblebee", "ladybird", "fly", "jellyfish", "squid", "crab"
]

class Animals {
    static getRandomAnimal() {
        return animals[Math.floor(Math.random() * animals.length)];
    }
}

module.exports.Animals = Animals;