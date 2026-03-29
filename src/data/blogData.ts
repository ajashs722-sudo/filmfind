import { BlogPost } from '../types';
import { getImageUrl } from '../services/tmdb';

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'the-evolution-of-sci-fi-cinema',
    title: 'The Evolution of Sci-Fi Cinema',
    excerpt: 'From Metropolis to Dune, explore how sci-fi has transformed visual storytelling.',
    content: `
      <p>Science fiction has always been a mirror to our hopes and fears. From <em>Metropolis</em> to <em>Dune: Part Two</em>, the genre pushes the boundaries of imagination.</p>
      <p>Before CGI, filmmakers used miniatures and matte paintings. Today, digital tools enhance human stories rather than replacing them.</p>
    `,
    author: 'Alex Rivers',
    date: '2026-03-15',
    image: getImageUrl('/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg', 'w780'),
    category: 'Analysis',
    tags: ['Sci-Fi', 'Cinema History', 'Dune', 'Visual Effects'],
    movieId: 438631,
  },
  {
    id: 2,
    slug: 'mastering-the-art-of-cinematography',
    title: 'Mastering the Art of Cinematography',
    excerpt: 'How directors use lighting, framing, and color to tell stories without words.',
    content: `
      <p>Cinematography is a complex language of light. <em>Oppenheimer</em> demonstrates how large-format film creates intimate psychological portraits.</p>
      <p>Color palettes establish mood, while framing dictates where the audience's attention goes.</p>
    `,
    author: 'Sarah Chen',
    date: '2026-03-20',
    image: getImageUrl('/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', 'w780'),
    category: 'Educational',
    tags: ['Cinematography', 'Directing', 'Oppenheimer', 'Film School'],
    movieId: 872585,
  },
  {
    id: 3,
    slug: 'the-rise-of-animation-for-adults',
    title: 'Beyond Kids: The Rise of Animation for Adult Audiences',
    excerpt: 'Animation is a medium, not a genre. Discover how modern animation is tackling complex themes and mature storytelling.',
    content: `
      <h2>Animation as a Medium</h2>
      <p>For too long, animation was pigeonholed as "just for kids." However, films like <em>Spider-Man: Across the Spider-Verse</em> have proven that animation can be the perfect vehicle for sophisticated, multi-layered storytelling.</p>
      
      <h3>Breaking the Visual Mold</h3>
      <p>Modern animation is experimenting with styles like never before. From the painterly look of <em>Arcane</em> to the mixed-media approach of the <em>Spider-Verse</em>, artists are breaking free from the "Disney style" to create unique visual identities.</p>
      
      <h3>Mature Themes and Emotional Depth</h3>
      <p>Animation allows for a level of abstraction and metaphor that live-action often struggles with. This makes it ideal for exploring grief, identity, and social commentary in ways that resonate deeply with adult viewers.</p>
    `,
    author: 'Marcus Thorne',
    date: '2026-03-25',
    image: getImageUrl('/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', 'w780'),
    category: 'Trends',
    tags: ['Animation', 'Spider-Verse', 'Storytelling', 'Modern Art'],
    movieId: 569094,
  },
  {
    id: 4,
    slug: 'the-last-night-time-machine-thriller',
    title: 'The Last Night: A Time Machine Thriller',
    excerpt: 'Two gangsters and a woman try to survive a dangerous night with a wild twist: a time machine.',
    content: `
      <p>In the gritty underworld, <em>The Last Night</em> injects a standard gangster premise with science fiction. How do you outrun your past when you can literally revisit it?</p>
      <p>The film balances raw energy with the mind-bending possibilities of temporal mechanics.</p>
    `,
    author: 'Alex Rivers',
    date: '2026-03-27',
    image: getImageUrl('/7F0jc75HrSkLVcvOXR2FXAIwuEv.jpg', 'w780'),
    category: 'Review',
    tags: ['Thriller', 'Time Travel', 'Crime', 'Sci-Fi'],
    movieId: 1115544,
  },
  {
    id: 5,
    slug: 'timur-the-fearless-warrior-empire',
    title: 'Timur: The Fearless Warrior',
    excerpt: 'The story of Timur, history’s greatest military leader, who founded the Timurid Empire.',
    content: `
      <p>In the 14th century, Timur emerged from exile to unite fractured kingdoms and carve an empire from chaos. Undefeated in battle, he founded the Timurid Empire, stretching from the Mediterranean to the borders of China. This film captures the scale of his campaigns from the steppes to Samarkand, offering a deep dive into the mind of a man who changed the course of history through sheer will and strategic brilliance.</p>
      
      <h3>The Rise of an Empire</h3>
      <p>Timur's journey is one of survival and absolute conquest. Starting with a small band of followers, he navigated the complex tribal politics of Central Asia to become the undisputed ruler of a vast territory. His empire became a center for art, science, and architecture, with Samarkand as its crown jewel, featuring the magnificent Registan Square and Bibi-Khanym Mosque.</p>
      
      <h3>Military Genius and Strategy</h3>
      <p>Timur is widely regarded as one of history's greatest military tacticians. His ability to adapt to different terrains and opponents made him an undefeated legend. He was known for his psychological warfare as much as his tactical maneuvers, often outthinking his enemies before the first arrow was even fired. This movie showcases his most famous battles, including the defeat of the Golden Horde and the Ottoman Sultan Bayezid I, with breathtaking realism and historical accuracy.</p>
      
      <h3>The Legacy of the Timurids</h3>
      <p>Beyond the battlefield, Timur was a patron of the arts and sciences. He brought the best craftsmen, scholars, and architects from across his conquered lands to Samarkand, sparking a cultural renaissance. The Timurid Renaissance laid the groundwork for the later Mughal Empire in India, as his descendant Babur would go on to found that legendary dynasty. The film explores this duality of Timur—the fierce conqueror and the visionary builder.</p>
      
      <h3>A Cinematic Masterpiece</h3>
      <p>With sweeping landscapes and epic battle sequences, <em>Timur</em> is more than just a historical biopic; it's a cinematic experience that transports viewers back to a time of legends. The attention to detail in costume design, weaponry, and period-accurate settings makes it a must-watch for history buffs and action fans alike.</p>
    `,
    author: 'Sarah Chen',
    date: '2026-03-28',
    image: getImageUrl('/9cRE0DsM6CNIiY9Ah3cd8oc3n1Y.jpg', 'w780'),
    category: 'Historical',
    tags: ['History', 'Epic', 'Timur', 'War'],
    movieId: 1207162,
  },
  {
    id: 6,
    slug: 'roar-the-goat-who-played-roarball',
    title: 'Roar: The Goat Who Played Roarball',
    excerpt: 'A small goat gets a shot to join the pros and play roarball, the fiercest sport in the world.',
    content: `
      <p>In a world of predators, one small goat proves that heart is the ultimate game-changer. <em>Roar</em> follows an unlikely athlete in the high-intensity world of Roarball.</p>
    `,
    author: 'Marcus Thorne',
    date: '2026-03-29',
    image: getImageUrl('/wfuqMlaExcoYiUEvKfVpUTt1v4u.jpg', 'w780'),
    category: 'Analysis',
    tags: ['Animation', 'Sports', 'Underdog', 'Family'],
    movieId: 1297842,
  },
  {
    id: 7,
    slug: 'sonic-the-hedgehog-4-the-blue-blur-returns',
    title: 'Sonic the Hedgehog 4',
    excerpt: 'The fourth installment in the Sonic film franchise is on the horizon. Here is what we know.',
    content: `
      <p>The blue blur is back! <em>Sonic the Hedgehog 4</em> marks the latest chapter in the successful adaptation history. Rumors swirl about new characters making their debut.</p>
    `,
    author: 'Alex Rivers',
    date: '2026-03-29',
    image: getImageUrl('/t8uoHBODkFlSQJRL6qc4IclUBlH.jpg', 'w780'),
    category: 'Trends',
    tags: ['Sonic', 'Sega', 'Action', 'Adventure'],
    movieId: 1401586,
  },
  {
    id: 8,
    slug: 'project-hail-mary-saving-earth-from-extinction',
    title: 'Project Hail Mary',
    excerpt: 'Ryland Grace wakes up light years from home to solve the riddle of the dying sun.',
    content: `
      <p>Based on Andy Weir's best-selling novel, <em>Project Hail Mary</em> is a sci-fi epic that brings hard science to the big screen with breathtaking realism. Ryland Grace, a science teacher turned astronaut, must use every bit of his scientific knowledge to save Earth from a solar extinction event.</p>
      <p>The film captures the isolation of deep space and the high stakes of a mission where failure is not an option. As Grace's memory returns, he uncovers the mystery of the "Astrophage" and forms an unexpected alliance that could change the fate of two civilizations.</p>
      <h3>Science Meets Spectacle</h3>
      <p>Director and the production team have worked closely with scientists to ensure that the physics and biology presented in the film are as accurate as possible, making the survival challenges feel grounded and intense.</p>
    `,
    author: 'Sarah Chen',
    date: '2026-03-29',
    image: getImageUrl('/yihdXomYb5kTeSivtFndMy5iDmf.jpg', 'w780'),
    category: 'Review',
    tags: ['Sci-Fi', 'Space', 'Survival', 'Science'],
    movieId: 687163,
  },
  {
    id: 9,
    slug: '2026-world-baseball-classic-netflix-record',
    title: '2026 World Baseball Classic™ Becomes Most-Watched Program on Netflix Japan',
    excerpt: 'The tournament delivered the largest-ever streaming audience across all platforms worldwide and marked the most streamed baseball game ever.',
    content: `
      <h3>Paving a new way forward for live sports viewing</h3>
      <p>The 2026 World Baseball Classic™, for which Netflix held exclusive streaming rights in Japan, has set a historic record. The live stream of the Japan vs. Australia game is now the most-watched title ever on Netflix in Japan — surpassing every series, film, anime, and other sports program on the service.</p>
      <p>Netflix’s exclusive streaming of the global baseball tournament in Japan this year delivered the largest-ever streaming audience across all platforms worldwide and marked the most streamed baseball game ever.</p>
      <p>This year’s tournament saw widespread adoption of Netflix’s uniquely flexible viewing styles — bunding smartphones and other mobile devices, catching up via on-demand replays, and expanding viewing beyond Japan’s games to marquee matchups between other countries.</p>
      <blockquote>"This tournament marked Netflix's successful entry into live sports streaming in Japan. I deeply admire the intense emotion and passionate drama both on and off the field." - Kaata Sakamoto, Netflix Japan Content</blockquote>
      <h3>Viewers and Demographics</h3>
      <p>In Japan, World Baseball Classic games on Netflix reached a total of 31.4M viewers. Viewers under 35 accounted for more than 30% of total viewership, with those aged 19 and under making up 14.2%.</p>
    `,
    author: 'Netflix Newsroom',
    date: '2026-03-25',
    image: 'https://images.ctfassets.net/4cd45et68cgf/3RokAWY9H7plbERZGnRtgk/8690d30a4120d3d7160aa3f17e7a4e43/en_us_wbc_main_main_16x9_1920x1080_rgb_evergreen.png?w=2000',
    category: 'Entertainment',
    tags: ['Global', 'Japan', 'Baseball', 'Streaming'],
  }
];
