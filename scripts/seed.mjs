/**
 * Seed script — creates 20 bot profiles, ~60 posts, and a follow graph.
 * Run with: node --env-file=.env.local scripts/seed.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing env vars. Run with: node --env-file=.env.local scripts/seed.mjs");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function avatar(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=53131e&color=fdf8ee&size=128&bold=true&rounded=true`;
}

// ─── Users ────────────────────────────────────────────────────────────────────

const USERS = [
  { username: "pastaprince",    displayName: "Marco Castellano" },
  { username: "wok_this_way",   displayName: "Yuki Tanaka" },
  { username: "savorsmith",     displayName: "Amara Osei" },
  { username: "butterandthyme", displayName: "Claire Dupont" },
  { username: "fermentfanatic", displayName: "Nils Bergström" },
  { username: "spicetrail",     displayName: "Priya Sharma" },
  { username: "grillmaster99",  displayName: "Jordan Hayes" },
  { username: "the_raw_kitchen",displayName: "Lily Chen" },
  { username: "sundayroast",    displayName: "Tom Fletcher" },
  { username: "tacoqueen",      displayName: "Sofia Reyes" },
  { username: "umamibomb",      displayName: "Kenji Park" },
  { username: "doughwhisperer", displayName: "Elena Rossi" },
  { username: "saltandsmoke",   displayName: "Marcus Brown" },
  { username: "nomad_kitchen",  displayName: "Fatou Diallo" },
  { username: "pho_real",       displayName: "Minh Nguyen" },
  { username: "alpine_cook",    displayName: "Heidi Müller" },
  { username: "citrus_herbs",   displayName: "Nadia Costa" },
  { username: "midnightsnacks", displayName: "Alex Kim" },
  { username: "farmtofork",     displayName: "Emma Whitfield" },
  { username: "ramenrider",     displayName: "Hiro Sato" },
];

// ─── Posts ────────────────────────────────────────────────────────────────────

// 3 posts per user, indexed by USERS position
const POSTS_BY_USER = [
  // 0 pastaprince
  [
    {
      title: "Cacio e Pepe",
      rating: 10,
      notes: "Finally nailed it — the secret is letting the pasta water cool slightly before adding to the cheese or it seizes up. Life changing.",
      photo: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80&auto=format&fit=crop",
      ingredients: ["200g tonnarelli or thick spaghetti", "80g Pecorino Romano, finely grated", "40g Parmigiano Reggiano", "2 tsp black pepper, freshly cracked", "Salt for pasta water"],
      steps: ["Toast pepper in a dry pan until fragrant, 2 min.", "Boil pasta in well-salted water until just al dente.", "Reserve 1 cup starchy pasta water.", "Off heat, let water cool 30 sec, then whisk in cheeses to form a paste.", "Toss pasta in cheese paste, adding water bit by bit until silky.", "Plate immediately with extra pepper and cheese."],
    },
    {
      title: "Pappardelle with Wild Boar Ragù",
      rating: 9,
      notes: "Slow Sunday project. Worth every hour. My nonna would approve.",
      photo: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800&q=80&auto=format&fit=crop",
      ingredients: ["500g wild boar shoulder, cubed", "200g fresh pappardelle", "1 bottle Chianti", "2 carrots, 2 celery, 1 onion", "4 garlic cloves", "400g crushed tomatoes", "Rosemary, sage, bay leaf", "Olive oil, salt, pepper"],
      steps: ["Marinate boar in wine with herbs overnight.", "Brown meat in batches in olive oil.", "Sauté soffritto until golden.", "Add meat back, pour in marinade + tomatoes.", "Braise covered at 160°C for 3 hours.", "Shred meat, reduce sauce, toss with pasta."],
    },
    {
      title: "Pasta e Fagioli",
      rating: 8,
      notes: "The kind of thing that tastes better the next day. My comfort food top 5 for sure.",
      photo: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80&auto=format&fit=crop",
      ingredients: ["400g cannellini beans", "150g ditalini pasta", "200g pancetta", "4 garlic cloves", "2 rosemary sprigs", "400g crushed tomatoes", "1.5L chicken stock", "Parmesan rind", "Good olive oil"],
      steps: ["Render pancetta until crispy, set aside.", "Sauté garlic in pancetta fat.", "Add beans, tomatoes, stock, rosemary, parmesan rind.", "Simmer 20 min, blend half the beans for body.", "Cook pasta in the soup until al dente.", "Finish with olive oil and pancetta."],
    },
  ],
  // 1 wok_this_way
  [
    {
      title: "Mapo Tofu",
      rating: 9,
      notes: "The numbing tingle from the Sichuan peppercorns is everything. Don't skip them.",
      photo: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80&auto=format&fit=crop",
      ingredients: ["400g silken tofu, cubed", "200g ground pork", "3 tbsp doubanjiang", "1 tbsp fermented black beans", "4 garlic cloves, minced", "1 tsp ginger, minced", "1 tbsp Sichuan peppercorns", "2 cups chicken stock", "Cornstarch slurry", "Green onions"],
      steps: ["Toast and grind Sichuan peppercorns.", "Fry pork until browned, add doubanjiang and black beans.", "Add garlic and ginger, fry 1 min.", "Pour in stock, bring to simmer.", "Gently add tofu, simmer 5 min.", "Thicken with cornstarch, top with peppercorn powder and scallions."],
    },
    {
      title: "Dan Dan Noodles",
      rating: 10,
      notes: "Made this three weeks in a row. The preserved vegetable is non-negotiable.",
      photo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80&auto=format&fit=crop",
      ingredients: ["200g thin wheat noodles", "150g ground pork", "2 tbsp ya cai (Yibin preserved veg)", "3 tbsp tahini", "2 tbsp chili oil", "1 tbsp soy sauce", "1 tsp black vinegar", "1 tsp sugar", "Sichuan peppercorn oil"],
      steps: ["Cook pork with ya cai until crispy.", "Whisk tahini, chili oil, soy, vinegar, sugar with hot water.", "Cook noodles, reserve water.", "Place sauce in bowls, top with noodles.", "Add pork mixture on top.", "Mix vigorously and eat immediately."],
    },
    {
      title: "Kung Pao Cauliflower",
      rating: 7,
      notes: "Skeptical going in, converted coming out. The texture with the roasting is actually great.",
      photo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop",
      ingredients: ["1 large cauliflower, florets", "Handful dried red chilies", "1/2 cup roasted peanuts", "3 garlic cloves", "1 tsp ginger", "2 tbsp soy sauce", "1 tbsp rice vinegar", "1 tbsp hoisin", "1 tsp sugar", "Sesame oil"],
      steps: ["Roast cauliflower at 220°C until charred edges.", "Fry dried chilies in oil until darkened.", "Add garlic and ginger, 30 sec.", "Add cauliflower and peanuts.", "Pour in sauce mixture, toss.", "Finish with sesame oil."],
    },
  ],
  // 2 savorsmith
  [
    {
      title: "Jollof Rice",
      rating: 10,
      notes: "Nigerian style. The party jollof from the fireside — smoky bottom is not a mistake, it's the point.",
      photo: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80&auto=format&fit=crop",
      ingredients: ["3 cups long grain parboiled rice", "400g crushed tomatoes", "3 red bell peppers", "4 scotch bonnet peppers", "1 large onion", "Chicken stock", "Tomato paste", "Bay leaves, thyme, curry powder", "Vegetable oil"],
      steps: ["Blend tomatoes, peppers and half the onion.", "Fry blended mixture in oil until darkened, 30 min.", "Add tomato paste, stock, seasoning.", "Wash rice and add to sauce.", "Cover tightly, cook on medium then low heat.", "Let the bottom catch slightly for the smoky crust."],
    },
    {
      title: "Egusi Soup",
      rating: 9,
      notes: "My mother's recipe. Takes patience but the flavour is worth it.",
      photo: "https://images.unsplash.com/photo-1540189549336-e6e99eb4b40d?w=800&q=80&auto=format&fit=crop",
      ingredients: ["2 cups ground egusi seeds", "500g beef and tripe", "2 cups palm oil", "Stock fish and dried fish", "Bitter leaf, washed", "Crayfish, ground", "3 scotch bonnet", "Salt and seasoning cubes"],
      steps: ["Boil meat with onion and seasoning until tender.", "Fry egusi paste in palm oil until fragrant.", "Add stock and meat, simmer 20 min.", "Add ground crayfish and fish.", "Add bitter leaf, cook 10 min.", "Adjust seasoning and serve with fufu."],
    },
    {
      title: "Kelewele",
      rating: 8,
      notes: "Spiced fried plantain. Best street food snack. Perfect as a side to anything.",
      photo: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80&auto=format&fit=crop",
      ingredients: ["3 ripe plantains", "1 tsp ginger, grated", "1 tsp cayenne", "1/2 tsp nutmeg", "Salt", "Vegetable oil for frying"],
      steps: ["Peel and cube plantains.", "Toss with ginger, cayenne, nutmeg and salt.", "Let marinate 15 min.", "Heat oil to 180°C.", "Fry plantain cubes until golden and crisp.", "Drain on paper towels, serve hot."],
    },
  ],
  // 3 butterandthyme
  [
    {
      title: "Boeuf Bourguignon",
      rating: 10,
      notes: "A Sunday project that pays off for three days. The wine matters — use something you'd actually drink.",
      photo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop",
      ingredients: ["1kg beef chuck, cubed", "1 bottle Burgundy or Pinot Noir", "200g lardons", "250g pearl onions", "300g mushrooms", "2 carrots, 1 celery stalk", "4 garlic cloves", "Thyme, bay leaf", "2 tbsp flour", "Butter"],
      steps: ["Marinate beef in wine with vegetables overnight.", "Brown lardons and remove.", "Brown beef in batches.", "Sauté veg, add flour and cook 2 min.", "Add wine marinade and stock.", "Braise at 160°C for 3 hours.", "Add pearl onions and mushrooms last 30 min."],
    },
    {
      title: "Tarte Tatin",
      rating: 9,
      notes: "A disaster that became a legend. The caramelisation is everything — don't rush it.",
      photo: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80&auto=format&fit=crop",
      ingredients: ["6 Granny Smith apples, peeled", "120g butter", "200g caster sugar", "1 sheet puff pastry", "Pinch of salt", "Crème fraîche to serve"],
      steps: ["Cook butter and sugar in ovenproof pan to amber caramel.", "Arrange apple halves tightly in caramel.", "Cook apples in caramel 20 min until softened.", "Cover with puff pastry, tuck in edges.", "Bake at 200°C for 25 min.", "Rest 5 min then flip confidently onto a plate."],
    },
  ],
  // 4 fermentfanatic
  [
    {
      title: "Homemade Kimchi",
      rating: 9,
      notes: "First successful batch after three attempts. The smell on day 3 is alarming but trust the process.",
      photo: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=800&q=80&auto=format&fit=crop",
      ingredients: ["1 large napa cabbage", "1/4 cup sea salt", "1/2 cup gochugaru", "8 garlic cloves", "2 tsp ginger", "4 spring onions", "2 tbsp fish sauce", "1 tsp sugar"],
      steps: ["Quarter and salt cabbage, leave 2 hours.", "Rinse and squeeze dry.", "Mix gochugaru, garlic, ginger, fish sauce, sugar.", "Combine paste with cabbage and spring onions.", "Pack tightly into jars.", "Ferment at room temp 1–3 days, then refrigerate."],
    },
    {
      title: "Sourdough Rye with Caraway",
      rating: 8,
      notes: "Nordic style, dense and tangy. Brilliant with strong cheese and cold butter.",
      photo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80&auto=format&fit=crop",
      ingredients: ["300g dark rye flour", "200g bread flour", "200g active sourdough starter", "350ml water", "12g salt", "2 tbsp caraway seeds"],
      steps: ["Mix flours, starter, water. Autolyse 1 hour.", "Add salt and caraway, mix well.", "Bulk ferment at room temp 4 hours with folds.", "Shape into loaf tin, refrigerate overnight.", "Bake with steam at 230°C for 45 min.", "Cool completely before slicing — at least 2 hours."],
    },
    {
      title: "Kvass-Braised Short Ribs",
      rating: 8,
      notes: "Used my homemade bread kvass as the braising liquid. Surprisingly deep and not at all funky.",
      photo: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&q=80&auto=format&fit=crop",
      ingredients: ["4 bone-in short ribs", "500ml dark kvass or stout", "2 onions, sliced", "4 garlic cloves", "2 tbsp caraway seeds", "2 tbsp soy sauce", "Thyme", "Butter for searing"],
      steps: ["Season ribs heavily, sear in butter until deeply browned.", "Caramelise onions in same pan.", "Add garlic and caraway, 1 min.", "Add kvass, soy, thyme.", "Braise covered at 150°C for 4 hours.", "Reduce braising liquid to glaze."],
    },
  ],
  // 5 spicetrail
  [
    {
      title: "Chicken Tikka Masala",
      rating: 9,
      notes: "Yes it's 'not really Indian' but my mum makes it and it tastes like home. That's enough.",
      photo: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80&auto=format&fit=crop",
      ingredients: ["600g chicken thighs", "1 cup yogurt", "2 tbsp tikka masala paste", "400ml cream", "400g crushed tomatoes", "2 onions", "Ginger, garlic", "Garam masala, cumin, coriander", "Butter, oil"],
      steps: ["Marinate chicken in yogurt and tikka paste 4 hours.", "Grill or broil until charred.", "Sauté onion, ginger, garlic in butter.", "Add spices and tomatoes, simmer 15 min.", "Blend sauce smooth.", "Add chicken and cream, simmer 10 min."],
    },
    {
      title: "Dal Makhani",
      rating: 10,
      notes: "Slow-cooked overnight. The butter and cream at the end feel wrong but do not skip them.",
      photo: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80&auto=format&fit=crop",
      ingredients: ["1 cup black lentils (urad dal)", "1/4 cup red kidney beans", "100g butter", "400g crushed tomatoes", "1 cup cream", "Ginger garlic paste", "Kashmiri chili powder", "Garam masala", "Dried fenugreek leaves"],
      steps: ["Soak lentils and beans overnight.", "Pressure cook until very soft.", "Mash slightly, cook with tomatoes and spices 1 hour.", "Add butter, cream, dried fenugreek.", "Simmer on lowest heat 30 more min.", "Finish with a knob of cold butter."],
    },
    {
      title: "Saag Paneer",
      rating: 8,
      notes: "The trick is blanching the spinach and shocking it in ice water to keep the green vivid.",
      photo: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80&auto=format&fit=crop",
      ingredients: ["500g fresh spinach", "400g paneer, cubed", "2 onions", "4 garlic cloves", "2 tsp ginger", "2 tsp cumin", "1 tsp garam masala", "1/2 cup cream", "Ghee"],
      steps: ["Blanch spinach 30 sec, shock in ice water.", "Blend spinach until smooth.", "Fry paneer in ghee until golden, remove.", "Sauté onion, garlic, ginger with spices.", "Add spinach purée, simmer 5 min.", "Add cream and paneer, heat through."],
    },
  ],
  // 6 grillmaster99
  [
    {
      title: "Brisket Low and Slow",
      rating: 10,
      notes: "14 hours. Two wood changes. The bark is everything. Slice against the grain or I will find you.",
      photo: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80&auto=format&fit=crop",
      ingredients: ["4kg whole brisket (packer cut)", "1/4 cup coarse black pepper", "2 tbsp kosher salt", "1 tbsp garlic powder", "Oak and cherry wood chunks"],
      steps: ["Trim fat cap to 1/4 inch.", "Apply rub night before.", "Start smoker at 107°C with oak wood.", "Smoke fat side up until 74°C internal.", "Wrap in butcher paper, continue to 93°C.", "Rest in cooler 2+ hours before slicing."],
    },
    {
      title: "St. Louis Ribs",
      rating: 9,
      notes: "3-2-1 method. No sauce until the last 30 minutes or you'll burn the sugars.",
      photo: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&auto=format&fit=crop",
      ingredients: ["2 racks St. Louis cut ribs", "Brown sugar, paprika, garlic powder", "Onion powder, cumin, cayenne", "Apple cider vinegar", "Your favourite BBQ sauce", "Hickory wood"],
      steps: ["Remove membrane from bone side.", "Apply dry rub generously.", "Smoke at 110°C for 3 hours.", "Wrap in foil with a splash of apple cider vinegar, 2 hours.", "Unwrap, sauce, and smoke 1 final hour.", "Rest 15 min before cutting."],
    },
  ],
  // 7 the_raw_kitchen
  [
    {
      title: "Walnut Meat Tacos",
      rating: 8,
      notes: "The pulse-in-processor texture is exactly right. Doesn't try to be meat, just tastes great.",
      photo: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80&auto=format&fit=crop",
      ingredients: ["2 cups raw walnuts", "2 tsp cumin", "1 tsp chili powder", "1 tsp smoked paprika", "2 tbsp tamari", "1 tbsp lime juice", "Small corn tortillas", "Avocado, mango salsa, lime"],
      steps: ["Pulse walnuts in food processor until crumbled (not a paste).", "Mix in spices and tamari.", "Let marinate 10 min.", "Warm tortillas on dry pan.", "Fill with walnut mixture.", "Top with avocado and mango salsa."],
    },
    {
      title: "Cashew Pad Thai",
      rating: 7,
      notes: "Used spiralised courgette instead of noodles. Actually a different dish but it works.",
      photo: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80&auto=format&fit=crop",
      ingredients: ["3 courgettes, spiralised", "1 cup raw cashews, soaked", "3 tbsp almond butter", "2 tbsp tamari", "Juice of 2 limes", "1 tbsp maple syrup", "Ginger, garlic", "Bean sprouts, spring onion, coriander"],
      steps: ["Blend soaked cashews with water, almond butter, tamari, lime, maple.", "Salt and drain courgette noodles.", "Toss noodles in sauce.", "Top with bean sprouts, spring onion.", "Garnish with coriander and lime.", "Serve immediately — it weeps if it sits."],
    },
  ],
  // 8 sundayroast
  [
    {
      title: "Proper Roast Chicken",
      rating: 9,
      notes: "Dry brine overnight. Spatchcock it. The skin goes properly golden and the thighs actually cook through. Game changer.",
      photo: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&q=80&auto=format&fit=crop",
      ingredients: ["1.8kg free-range chicken", "2 tbsp kosher salt", "Lemon, halved", "Whole head of garlic", "Thyme, rosemary", "Butter, softened"],
      steps: ["Spatchcock chicken by removing backbone with scissors.", "Salt all over, refrigerate uncovered overnight.", "Bring to room temp 1 hour before cooking.", "Smear with herb butter under and over skin.", "Roast on a bed of lemon and garlic at 220°C for 40 min.", "Rest 15 min before carving."],
    },
    {
      title: "Yorkshire Puddings",
      rating: 10,
      notes: "They rose. First time in five attempts they actually rose. Screamed a little.",
      photo: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&q=80&auto=format&fit=crop",
      ingredients: ["3 eggs", "125ml whole milk", "125g plain flour", "Pinch of salt", "4 tbsp beef dripping or lard"],
      steps: ["Whisk eggs, milk and flour until completely smooth.", "Rest batter at room temp 1 hour.", "Heat dripping in tin in 240°C oven until smoking.", "Pour cold batter immediately into hot fat.", "Do not open the oven for 20 minutes.", "Cook 25 min total until golden and risen."],
    },
    {
      title: "Sticky Toffee Pudding",
      rating: 10,
      notes: "The dates vanish into the sponge and you'd never know they're there. The sauce is the point though.",
      photo: "https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=800&q=80&auto=format&fit=crop",
      ingredients: ["175g Medjool dates, pitted", "250ml boiling water", "1 tsp bicarbonate of soda", "75g butter", "175g brown sugar", "2 eggs", "175g self-raising flour", "Vanilla", "Toffee sauce: butter, cream, dark sugar"],
      steps: ["Soak dates in boiling water with bicarb 30 min, then blend.", "Cream butter and sugar, add eggs.", "Fold in flour and date mixture.", "Bake at 180°C for 30 min.", "Make toffee sauce: melt butter, sugar, cream together.", "Poke holes in warm pudding, pour half the sauce over."],
    },
  ],
  // 9 tacoqueen
  [
    {
      title: "Birria Tacos",
      rating: 10,
      notes: "Three days of planning, thirty seconds of eating. Dipping in the consommé is non-negotiable.",
      photo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80&auto=format&fit=crop",
      ingredients: ["1kg goat or beef short ribs", "4 guajillo chilies", "2 ancho chilies", "4 chipotle in adobo", "Cinnamon, cloves, cumin, oregano", "Corn tortillas", "White onion, coriander", "Lime, Oaxaca cheese"],
      steps: ["Toast and rehydrate dried chilies.", "Blend chilies with spices and vinegar to smooth paste.", "Marinate meat in paste overnight.", "Braise at 150°C for 4 hours until very tender.", "Shred meat, reserve consommé.", "Dip tortillas in fat on top of consommé, fry with cheese and meat."],
    },
    {
      title: "Elotes",
      rating: 9,
      notes: "Street corn. The cotija situation is real. Don't substitute with feta — get the actual thing.",
      photo: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80&auto=format&fit=crop",
      ingredients: ["4 corn on the cob", "1/4 cup mayonnaise", "1/4 cup Mexican crema", "1/2 cup cotija cheese, crumbled", "1 tsp chili powder", "Lime juice", "Fresh coriander", "Tajín for serving"],
      steps: ["Grill corn over high heat turning often, until charred in spots.", "Mix mayo and crema.", "Brush hot corn with mayo mixture.", "Roll in crumbled cotija.", "Sprinkle with chili powder and Tajín.", "Squeeze lime over and serve immediately."],
    },
  ],
  // 10 umamibomb
  [
    {
      title: "Gyudon (Beef Bowl)",
      rating: 9,
      notes: "20 minute meal that tastes like it took all day. Thinly sliced beef is everything.",
      photo: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80&auto=format&fit=crop",
      ingredients: ["300g beef (ribeye or chuck), thinly sliced", "1 large onion, sliced", "3 tbsp soy sauce", "2 tbsp mirin", "1 tbsp sake", "1 tsp sugar", "Dashi or water", "Steamed rice", "Soft-boiled egg, pickled ginger"],
      steps: ["Simmer onion in dashi until soft.", "Add soy, mirin, sake, sugar.", "Add beef, cook just until no longer pink.", "Ladle over rice.", "Top with soft egg and pickled ginger.", "Eat immediately."],
    },
    {
      title: "Kimchi Jjigae",
      rating: 10,
      notes: "Use old, well-fermented kimchi. Fresh kimchi makes a completely different dish. The anchovies are the foundation.",
      photo: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&q=80&auto=format&fit=crop",
      ingredients: ["400g aged kimchi + 1/2 cup kimchi juice", "200g pork belly, sliced", "300g silken tofu", "Dried anchovies for stock", "4 garlic cloves", "2 tsp gochugaru", "1 tsp sesame oil", "Spring onions"],
      steps: ["Make quick dashi with dried anchovies.", "Fry pork belly until slightly crispy.", "Add kimchi and juice, stir-fry 3 min.", "Add dashi, garlic, gochugaru.", "Simmer 20 min until kimchi is silky.", "Add tofu, cook 5 more min, finish with sesame oil."],
    },
    {
      title: "Okonomiyaki",
      rating: 8,
      notes: "Osaka style. I'm not accepting the Hiroshima argument today.",
      photo: "https://images.unsplash.com/photo-1546069096-22dcbbeb87fb?w=800&q=80&auto=format&fit=crop",
      ingredients: ["200g plain flour", "250ml dashi", "3 eggs", "400g napa cabbage, shredded", "200g pork belly, thin slices", "Tenkasu (tempura bits)", "Nagaimo (optional)", "Okonomiyaki sauce", "Japanese mayo, aonori, katsuobushi"],
      steps: ["Mix flour, dashi and eggs to batter.", "Fold in cabbage and tenkasu.", "Heat oil in pan, pour in batter.", "Top with pork belly slices.", "Cook 5 min, flip carefully.", "Cook 5 min more, top with sauce, mayo, aonori, katsuobushi."],
    },
  ],
  // 11 doughwhisperer
  [
    {
      title: "Croissants",
      rating: 9,
      notes: "Three days start to finish. The lamination is meditation. Shattered layers mean you did it right.",
      photo: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80&auto=format&fit=crop",
      ingredients: ["500g bread flour", "10g salt", "75g sugar", "10g instant yeast", "300ml cold milk", "280g cold butter for lamination", "1 egg for egg wash"],
      steps: ["Make détrempe, rest overnight.", "Bash cold butter into a flat slab.", "Encase butter in dough, make 3 letter folds with rests.", "Repeat twice more, refrigerating between.", "Roll, cut triangles, roll into croissants.", "Proof until jiggly, egg wash, bake at 190°C for 18 min."],
    },
    {
      title: "Focaccia",
      rating: 10,
      notes: "The olive oil situation is not a mistake. It should be swimming. That's how it works.",
      photo: "https://images.unsplash.com/photo-1515816052601-210d5501d471?w=800&q=80&auto=format&fit=crop",
      ingredients: ["500g bread flour", "10g salt", "7g instant yeast", "400ml warm water", "100ml good olive oil + more for pan", "Flaky sea salt", "Rosemary", "Cherry tomatoes"],
      steps: ["Mix flour, salt, yeast, water and 50ml oil.", "Bulk ferment with stretch-and-folds for 4 hours.", "Pour remaining oil into pan, place dough.", "Refrigerate overnight.", "Dimple vigorously with oily fingers.", "Top and bake at 220°C for 25 min until golden and crisp."],
    },
  ],
  // 12 saltandsmoke
  [
    {
      title: "Carolina Pulled Pork",
      rating: 10,
      notes: "Vinegar sauce, not tomato. This is not a debate. The shoulder was 11 hours at 110°C.",
      photo: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80&auto=format&fit=crop",
      ingredients: ["3kg pork shoulder (bone-in)", "Dry rub: brown sugar, paprika, garlic, pepper, salt, cayenne", "Apple cider vinegar", "Red pepper flakes", "Carolina gold sauce (vinegar base)"],
      steps: ["Apply rub the night before.", "Smoke at 110°C with hickory and pecan, 8–12 hours.", "Pull at 93°C internal, wrap and rest 2 hours.", "Pull into chunks (not shredded — chunks matter).", "Toss in splash of cider vinegar and red pepper.", "Serve on plain white buns with coleslaw."],
    },
    {
      title: "Smoked Mac and Cheese",
      rating: 9,
      notes: "Made this as a BBQ side and now it's been requested at every family event. A monster I created.",
      photo: "https://images.unsplash.com/photo-1619881590738-a8b39a6f1a6e?w=800&q=80&auto=format&fit=crop",
      ingredients: ["500g elbow macaroni", "100g butter", "100g plain flour", "1L whole milk", "250g sharp cheddar", "150g Gruyère", "100g smoked Gouda", "Panko breadcrumbs", "Smoked paprika"],
      steps: ["Make roux with butter and flour.", "Add milk gradually, whisking.", "Off heat, melt in cheeses.", "Combine with cooked pasta.", "Pour into cast iron pan.", "Top with panko and smoked paprika, smoke at 120°C for 1 hour."],
    },
  ],
  // 13 nomad_kitchen
  [
    {
      title: "Thiéboudienne",
      rating: 10,
      notes: "Senegal's national dish. The rice absorbing the fish broth at the bottom is the best part. The 'xoox' — the browned rice — is not burned, it's a feature.",
      photo: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80&auto=format&fit=crop",
      ingredients: ["1kg firm white fish (grouper or sea bass)", "600g broken rice (or parboiled)", "Tomato paste, tomatoes", "Cabbage, cassava, carrot, aubergine", "Onion, garlic, scotch bonnet", "Fish sauce, bouillon", "Tamarind paste", "Palm oil"],
      steps: ["Stuff fish with garlic-parsley paste (roff).", "Brown fish in oil, set aside.", "Fry tomato paste until darkened.", "Add water, vegetables, bouillon.", "Cook vegetables, then add rice and fish.", "Cover tightly, steam until rice absorbs all liquid.", "Scrape the browned crust from the bottom."],
    },
    {
      title: "Yassa Poulet",
      rating: 9,
      notes: "The overnight lemon-onion marinade is what makes it. Don't cut the time short.",
      photo: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&q=80&auto=format&fit=crop",
      ingredients: ["1 whole chicken, jointed", "6 large onions, sliced", "Juice of 4 lemons", "4 garlic cloves", "2 scotch bonnet or habanero", "1 tsp mustard", "Bay leaves, black pepper", "Oil for browning"],
      steps: ["Marinate chicken in lemon juice, onions, garlic, pepper overnight.", "Remove chicken, grill or broil until charred.", "Caramelise onions from marinade until golden.", "Add marinade liquid, garlic, mustard.", "Add chicken back, braise 30 min.", "Serve over broken rice."],
    },
  ],
  // 14 pho_real
  [
    {
      title: "Beef Pho",
      rating: 10,
      notes: "The broth took 8 hours. Charred the ginger and onion. Toasted the spices. Skimmed constantly. It was worth every second.",
      photo: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop",
      ingredients: ["2kg beef bones (knuckle and marrow)", "500g beef brisket", "1 large onion, charred", "4-inch ginger, charred", "Star anise, cinnamon, cardamom, cloves", "Fish sauce, salt, rock sugar", "Flat rice noodles", "Bean sprouts, Thai basil, lime, sliced beef (rare)"],
      steps: ["Parboil bones 10 min, discard water, rinse.", "Char onion and ginger directly on flame.", "Toast spices in dry pan until fragrant.", "Simmer bones 6–8 hours, skimming frequently.", "Add charred aromatics and spices.", "Season with fish sauce and rock sugar.", "Slice brisket thin, cook noodles, assemble and pour boiling broth over rare beef."],
    },
    {
      title: "Bún Bò Huế",
      rating: 9,
      notes: "Spicier and more complex than pho. The lemongrass and shrimp paste base is incredible. Under-talked about.",
      photo: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80&auto=format&fit=crop",
      ingredients: ["1.5kg pork and beef bones", "500g pork hock", "300g beef brisket", "Lemongrass stalks (lots)", "Fermented shrimp paste (mắm ruốc)", "Annatto oil for colour", "Chili paste", "Round rice noodles (bún)", "Herbs: banana blossom, mint, perilla"],
      steps: ["Simmer bones and hock 3 hours.", "Char lemongrass and add to broth.", "Bloom annatto oil with lemongrass and chili.", "Add to broth with shrimp paste.", "Season and simmer 30 more min.", "Serve over noodles with pork hock slices and fresh herbs."],
    },
  ],
  // 15 alpine_cook
  [
    {
      title: "Käsespätzle",
      rating: 9,
      notes: "Austrian mac and cheese, essentially, but somehow more comforting. The crispy onions on top are compulsory.",
      photo: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80&auto=format&fit=crop",
      ingredients: ["300g plain flour", "4 eggs", "100ml water", "250g Emmental or Bergkäse, grated", "2 large onions, sliced thin", "Butter", "Salt, white pepper, nutmeg"],
      steps: ["Beat eggs, flour, water into thick batter.", "Press through spätzle maker into boiling salted water.", "Cook until floating, drain.", "Layer in buttered dish with cheese, season.", "Fry onions slowly in butter until very dark golden.", "Top spätzle with caramelised onions, finish in 180°C oven 10 min."],
    },
    {
      title: "Raclette Night",
      rating: 10,
      notes: "Less a recipe, more a lifestyle. Cornichons and pearl onions are not optional. Everything else is.",
      photo: "https://images.unsplash.com/photo-1513135467880-6c41603a8a8b?w=800&q=80&auto=format&fit=crop",
      ingredients: ["600g Raclette cheese, sliced", "500g waxy potatoes", "Cornichons", "Pearl onions pickled", "Charcuterie: coppa, bresaola, ham", "Sourdough bread", "Freshly cracked pepper"],
      steps: ["Boil potatoes in their skins until just tender.", "Set up raclette grill.", "Fill individual trays with cheese, melt until bubbling.", "Scrape over potatoes.", "Pile cornichons and pickled onions alongside.", "Eat immediately, repeat until very full."],
    },
  ],
  // 16 citrus_herbs
  [
    {
      title: "Greek-Style Lamb Shoulder",
      rating: 10,
      notes: "Slow-roasted with lemon and oregano until it falls apart. Sunday at its most essential.",
      photo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop",
      ingredients: ["1.5kg bone-in lamb shoulder", "8 garlic cloves", "Juice and zest of 2 lemons", "4 tbsp dried Greek oregano", "Olive oil", "1 cup white wine", "Salt, black pepper"],
      steps: ["Stab lamb all over, push in garlic slivers.", "Rub with lemon zest, oregano, oil, salt.", "Pour wine and lemon juice into roasting tin.", "Cover tightly with foil.", "Roast at 160°C for 4–5 hours.", "Uncover last 30 min to crisp the outside."],
    },
    {
      title: "Spanakopita",
      rating: 8,
      notes: "The phyllo sheets have to be properly oiled or they don't go crispy. That's the whole thing.",
      photo: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80&auto=format&fit=crop",
      ingredients: ["500g spinach, blanched and squeezed dry", "300g feta, crumbled", "4 eggs", "4 spring onions", "Dill, mint", "500g phyllo pastry", "120ml olive oil + butter"],
      steps: ["Mix spinach, feta, eggs, herbs.", "Layer 6 phyllo sheets, oiling each.", "Add filling, fold over sides.", "Layer 6 more sheets on top, oiling each.", "Score into squares, bake at 180°C for 45 min.", "Cool 15 min before cutting through."],
    },
    {
      title: "Lemon Posset",
      rating: 9,
      notes: "Three ingredients. No gelatine, no eggs. Just acid curdling cream. Feels like a magic trick.",
      photo: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80&auto=format&fit=crop",
      ingredients: ["600ml double cream", "150g caster sugar", "Juice of 3 lemons (90ml)", "Zest to garnish", "Shortbread to serve"],
      steps: ["Bring cream and sugar to a rolling boil.", "Boil 3 minutes, stirring.", "Remove from heat, add lemon juice.", "Stir, then let cool 10 min.", "Pour into glasses and refrigerate 3+ hours.", "Serve with shortbread and a little zest."],
    },
  ],
  // 17 midnightsnacks
  [
    {
      title: "Spicy Instant Noodles Upgrade",
      rating: 8,
      notes: "Starting from a packet of Shin Ramyun and making it actually good. Don't skip the butter.",
      photo: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80&auto=format&fit=crop",
      ingredients: ["1 packet Shin Ramyun", "2 eggs", "50g butter", "4 garlic cloves, minced", "1 tbsp gochujang", "Slice of processed cheese", "Spring onions", "Sesame oil"],
      steps: ["Boil noodles, reserve some liquid.", "In separate pan, fry garlic in butter.", "Add gochujang, fry 30 sec.", "Add noodles and seasoning packet.", "Add splash of noodle water.", "Top with soft-boiled eggs, cheese, spring onions, sesame oil."],
    },
    {
      title: "Midnight Quesadilla",
      rating: 9,
      notes: "Fridge-raid rules apply. Leftover anything goes. The key is low and slow for crispy.",
      photo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80&auto=format&fit=crop",
      ingredients: ["2 large flour tortillas", "150g mixed cheese (whatever is in the fridge)", "Any leftovers", "Pickled jalapeños", "Hot sauce", "Sour cream to dip"],
      steps: ["Heat pan on lowest setting.", "Place one tortilla, add cheese and fillings.", "Top with second tortilla.", "Cook very slowly 5 min until underside is golden.", "Flip carefully, cook 3 more min.", "Rest 2 min before cutting — molten cheese needs to settle."],
    },
  ],
  // 18 farmtofork
  [
    {
      title: "Allotment Frittata",
      rating: 8,
      notes: "Whatever was ready this week: cavolo nero, leeks, new potatoes. Flexible recipe, rigid principle.",
      photo: "https://images.unsplash.com/photo-1567620905733-2153b64e0774?w=800&q=80&auto=format&fit=crop",
      ingredients: ["6 eggs", "Cavolo nero, roughly chopped", "2 leeks, sliced", "4 small new potatoes, sliced thin", "100g aged cheddar", "Thyme", "Butter, oil", "Salt, pepper"],
      steps: ["Cook potatoes in ovenproof pan in butter until golden.", "Add leeks and cavolo nero, soften.", "Beat eggs with half the cheese, season well.", "Pour egg mixture over vegetables.", "Cook on hob until edges set, top with remaining cheese.", "Finish under grill until puffed and golden."],
    },
    {
      title: "Roasted Tomato Soup",
      rating: 9,
      notes: "Made only when tomatoes are at peak summer. Roasting them is not optional — it's the entire flavour.",
      photo: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80&auto=format&fit=crop",
      ingredients: ["1.5kg ripe tomatoes, halved", "1 large onion, quartered", "8 garlic cloves", "Thyme and basil", "Good olive oil", "Vegetable stock", "Cream to finish", "Sourdough to serve"],
      steps: ["Toss tomatoes, onion, garlic with oil and thyme.", "Roast at 190°C for 45 min until caramelised.", "Transfer to pot with stock.", "Blend smooth.", "Pass through sieve for silky texture.", "Reheat, finish with cream and torn basil."],
    },
  ],
  // 19 ramenrider
  [
    {
      title: "Tonkotsu Ramen",
      rating: 10,
      notes: "12-hour broth. The milky white colour comes from the vigorous boil — don't lower the heat. Tare and fat are everything.",
      photo: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80&auto=format&fit=crop",
      ingredients: ["2kg pork trotters and neck bones", "Chicken carcass", "Ginger, garlic", "Spring onion whites", "Fresh ramen noodles (thin, straight)", "Chashu pork belly", "Soft-boiled shoyu eggs", "Bamboo shoots, nori, sesame seeds"],
      steps: ["Parboil bones 10 min, discard, rinse.", "Boil vigorously (not simmer) with ginger and spring onions for 8–12 hours.", "Strain and season with shoyu tare and salt.", "Cook noodles separately.", "Warm bowls, add tare, ladle hot broth over.", "Top with chashu, egg, bamboo, nori."],
    },
    {
      title: "Miso Ramen",
      rating: 9,
      notes: "The miso tare has to be mixed with hot fat before adding to broth. That's what makes it different from just adding miso to soup.",
      photo: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&q=80&auto=format&fit=crop",
      ingredients: ["3 types miso (shiro, aka, mugi)", "Sake, mirin, garlic, ginger", "Chicken or pork broth", "Ground sesame", "Corn, butter", "Bean sprouts, wood ear mushrooms", "Ramen noodles (wavy, thick)", "Chashu or minced pork"],
      steps: ["Blend misos with sake, mirin, garlic, ginger.", "Fry miso tare in lard or chicken fat until aromatic.", "Combine with hot broth.", "Cook noodles, stir-fry bean sprouts with garlic.", "Assemble with corn, butter pat on top.", "Finish with sesame and white pepper."],
    },
    {
      title: "Shoyu Chicken Ramen",
      rating: 8,
      notes: "The clear broth style. More delicate than tonkotsu but just as layered if you do the tare right.",
      photo: "https://images.unsplash.com/photo-1546069096-22dcbbeb87fb?w=800&q=80&auto=format&fit=crop",
      ingredients: ["1 whole chicken", "Chicken feet (optional but worth it)", "Dashi (kombu + katsuobushi)", "Shoyu tare: soy, mirin, sake, sugar", "Thin wavy noodles", "Menma (bamboo)", "Soft egg", "Spring onion, nori"],
      steps: ["Simmer chicken gently 2 hours — do not boil.", "Make dashi separately.", "Combine chicken and dashi broths.", "Season to taste with shoyu tare.", "Cook noodles, warm bowls.", "Assemble with chicken, menma, egg, nori."],
    },
  ],
];

// ─── Follow graph ──────────────────────────────────────────────────────────────
// [followerIndex, followingIndex] — using USERS array indices
const FOLLOW_PAIRS = [
  // ramenrider + pho_real are besties — mutual follows
  [19, 14], [14, 19],
  // umamibomb follows both Asian food people
  [10, 1], [10, 19], [10, 14],
  // pastaprince + butterandthyme mutual European food bond
  [0, 3], [3, 0],
  // spicetrail follows lots (she's social)
  [5, 0], [5, 3], [5, 10], [5, 13],
  // savorsmith + nomad_kitchen — West African solidarity
  [2, 13], [13, 2],
  // fermentfanatic follows doughwhisperer
  [4, 11], [11, 4],
  // grillmaster + saltandsmoke BBQ crew
  [6, 12], [12, 6],
  // tacoqueen follows nomad_kitchen and spicetrail
  [9, 13], [9, 5],
  // sundayroast follows butterandthyme and alpine_cook
  [8, 3], [8, 15],
  // farmtofork follows citrus_herbs
  [18, 16], [16, 18],
  // midnightsnacks follows ramenrider and umamibomb
  [17, 19], [17, 10],
  // the_raw_kitchen follows farmtofork
  [7, 18], [18, 7],
  // alpine_cook follows doughwhisperer
  [15, 11],
  // wok_this_way follows umamibomb
  [1, 10], [10, 1],
  // doughwhisperer follows butterandthyme
  [11, 3],
  // pho_real follows umamibomb and wok_this_way
  [14, 10], [14, 1],
  // ramenrider follows wok_this_way
  [19, 1],
  // midnightsnacks follows wok_this_way and spicetrail
  [17, 1], [17, 5],
  // citrus_herbs follows butterandthyme and alpine_cook
  [16, 3], [16, 15],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function run() {
  console.log("🌱  Seeding Simmer...\n");

  // 1. Insert profiles
  console.log("→ Creating profiles...");
  const profileRows = USERS.map((u, i) => ({
    clerk_user_id: `seed_bot_${String(i + 1).padStart(2, "0")}`,
    username: u.username,
    display_name: u.displayName,
    avatar_url: avatar(u.displayName),
  }));

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .upsert(profileRows, { onConflict: "username" })
    .select("id, username");

  if (profileError) {
    console.error("Profile insert failed:", profileError.message);
    process.exit(1);
  }

  // Build username → id map
  const profileMap = {};
  for (const p of profiles) profileMap[p.username] = p.id;

  console.log(`   ✓ ${profiles.length} profiles`);

  // 2. Insert posts + ingredients + steps
  console.log("→ Creating posts...");
  let totalPosts = 0;

  for (let userIdx = 0; userIdx < USERS.length; userIdx++) {
    const username = USERS[userIdx].username;
    const profileId = profileMap[username];
    if (!profileId) {
      console.warn(`   ⚠ No profile found for ${username}`);
      continue;
    }

    const userPosts = POSTS_BY_USER[userIdx] ?? [];

    for (const post of userPosts) {
      // Insert post
      const { data: postRow, error: postError } = await supabase
        .from("posts")
        .insert({
          profile_id: profileId,
          title: post.title,
          rating: post.rating,
          notes: post.notes,
          photo_url: post.photo,
        })
        .select("id")
        .single();

      if (postError) {
        console.error(`   ✗ Post "${post.title}" failed:`, postError.message);
        continue;
      }

      const postId = postRow.id;

      // Insert ingredients
      const ingredients = post.ingredients.map((content, sort_order) => ({
        post_id: postId,
        content,
        sort_order,
      }));

      const { error: ingError } = await supabase
        .from("post_ingredients")
        .insert(ingredients);

      if (ingError) console.warn(`   ⚠ Ingredients for "${post.title}":`, ingError.message);

      // Insert steps
      const steps = post.steps.map((content, sort_order) => ({
        post_id: postId,
        content,
        sort_order,
      }));

      const { error: stepError } = await supabase.from("post_steps").insert(steps);

      if (stepError) console.warn(`   ⚠ Steps for "${post.title}":`, stepError.message);

      totalPosts++;
    }
  }

  console.log(`   ✓ ${totalPosts} posts`);

  // 3. Insert follows
  console.log("→ Creating follow graph...");

  const followRows = [];
  const seen = new Set();

  for (const [followerIdx, followingIdx] of FOLLOW_PAIRS) {
    const followerUsername = USERS[followerIdx]?.username;
    const followingUsername = USERS[followingIdx]?.username;
    const followerId = profileMap[followerUsername];
    const followingId = profileMap[followingUsername];

    if (!followerId || !followingId) continue;
    if (followerId === followingId) continue;

    const key = `${followerId}:${followingId}`;
    if (seen.has(key)) continue;
    seen.add(key);

    followRows.push({ follower_id: followerId, following_id: followingId });
  }

  const { error: followError } = await supabase
    .from("follows")
    .upsert(followRows, { onConflict: "follower_id,following_id" });

  if (followError) {
    console.error("Follow insert failed:", followError.message);
  } else {
    console.log(`   ✓ ${followRows.length} follow relationships`);
  }

  console.log("\n✅  Done! Your Simmer feed is now populated.\n");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
