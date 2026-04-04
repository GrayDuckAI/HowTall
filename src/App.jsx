import { useState, useMemo } from "react";

const HEIDI_INCHES = 70.5;

function toInches(h) {
  const m = h.match(/(\d+)'(?:\s*(\d+(?:\.\d+)?)(?:"|'')?)?/);
  if (!m) return 0;
  return parseInt(m[1]) * 12 + parseFloat(m[2] || 0);
}

function diffLabel(inches) {
  const diff = Math.abs(inches - HEIDI_INCHES);
  const ft = Math.floor(diff / 12);
  const i = +(diff % 12).toFixed(1);
  const str = ft > 0 ? `${ft}'${i > 0 ? i + '"' : ''}` : `${i}"`;
  if (inches > HEIDI_INCHES) return `+${str} taller`;
  if (inches < HEIDI_INCHES) return `${str} shorter`;
  return "same height";
}

const GENDER_STYLES = {
  Male:   { bg: "#dbeafe", color: "#1e40af" },
  Female: { bg: "#fce7f3", color: "#9d174d" },
  Trans:  { bg: "#dcfce7", color: "#166534" },
};

const CATEGORIES = ["All","Favorites","Actor","Musician","Athlete","Author","Olympian","Other"];

const CAT_COLORS = {
  Actor:    { bg: "#dcfce7", color: "#166534" },
  Musician: { bg: "#ede9fe", color: "#5b21b6" },
  Athlete:  { bg: "#dbeafe", color: "#1e40af" },
  Author:   { bg: "#fef3c7", color: "#92400e" },
  Olympian: { bg: "#fce7f3", color: "#9d174d" },
  Other:    { bg: "#f3f4f6", color: "#374151" },
};

const CAT_BTN_COLORS = {
  All: "#374151", Favorites: "#b45309", Actor: "#166534",
  Musician: "#5b21b6", Athlete: "#1e40af", Author: "#92400e",
  Olympian: "#9d174d", Other: "#374151",
};

const GENDERS = ["All","Male","Female","Trans"];

function getCategory(fame) {
  const f = fame.toLowerCase();
  if (/olympic|olympian|gold medal|gymnast|figure skat|speed skat|snowboard|diving|decathlon|heptathlon|sprint|swimmer/.test(f)) return "Olympian";
  if (/actor|actress|director|hollywood|film|oscar|bond|cinema|movie/.test(f)) return "Actor";
  if (/nba|nhl|soccer|tennis|nfl|mlb|wrestler|skateboarder|boxer|mma|athlete/.test(f)) return "Athlete";
  if (/singer|band|frontman|frontwoman|guitarist|bassist|drummer|punk|rock|pop|motown|reggae|soul|country|jazz|musician|rapper|dj/.test(f)) return "Musician";
  if (/author|novelist|poet|writer|journalist|essayist/.test(f)) return "Author";
  return "Other";
}

const btn = (active, color) => ({
  padding: "6px 14px", fontSize: 13, borderRadius: 20, cursor: "pointer", fontWeight: active ? 500 : 400,
  background: active ? (color || "#1e40af") : "transparent",
  color: active ? "white" : "#6b7280",
  border: active ? `1px solid ${color || "#1e40af"}` : "1px solid #e5e7eb",
  transition: "all 0.15s", fontFamily: "inherit",
});

const CELEBS_RAW = [
  ["Shaquille O'Neal","NBA legend, actor","7'1\"","Male"],
  ["Kareem Abdul-Jabbar","NBA all-time scoring leader","7'2\"","Male"],
  ["Yao Ming","NBA center, diplomat","7'6\"","Male"],
  ["Wilt Chamberlain","NBA legend","7'1\"","Male"],
  ["Boban Marjanović","NBA center","7'4\"","Male"],
  ["Peter Mayhew","Chewbacca actor","7'3\"","Male"],
  ["Richard Kiel","Jaws in James Bond","7'2\"","Male"],
  ["Gheorghe Mureșan","NBA player, actor","7'7\"","Male"],
  ["André the Giant","Wrestler, actor, Princess Bride","7'4\"","Male"],
  ["Zdeno Chára","NHL defenseman, Olympic medalist","6'9\"","Male"],
  ["LeBron James","NBA superstar","6'9\"","Male"],
  ["Kevin Durant","NBA superstar","6'10\"","Male"],
  ["Giannis Antetokounmpo","NBA MVP","6'11\"","Male"],
  ["Dirk Nowitzki","NBA MVP, Finals champion","7'0\"","Male"],
  ["Magic Johnson","NBA legend","6'9\"","Male"],
  ["Pau Gasol","NBA champion, Olympic medalist","7'0\"","Male"],
  ["Nikola Jokić","NBA MVP","6'11\"","Male"],
  ["Joel Embiid","NBA MVP","7'0\"","Male"],
  ["Tim Duncan","NBA legend","6'11\"","Male"],
  ["David Robinson","NBA legend, Olympic gold medalist","7'1\"","Male"],
  ["Alex Ovechkin","NHL goal scoring legend","6'3\"","Male"],
  ["Sidney Crosby","NHL champion","5'11\"","Male"],
  ["Wayne Gretzky","The Great One, NHL legend","6'0\"","Male"],
  ["Eric Lindros","NHL star","6'4\"","Male"],
  ["Jaromir Jagr","NHL legend","6'2\"","Male"],
  ["Patrick Roy","NHL goalie legend","6'0\"","Male"],
  ["Mark Messier","NHL champion","6'1\"","Male"],
  ["Brett Hull","NHL legend","5'11\"","Male"],
  ["Mario Lemieux","NHL legend","6'4\"","Male"],
  ["Chris Chelios","NHL defenseman, Olympic medalist","6'1\"","Male"],
  ["Scott Stevens","NHL defenseman","6'2\"","Male"],
  ["Brendan Shanahan","NHL champion","6'3\"","Male"],
  ["Joe Sakic","NHL captain, Olympic gold medalist","5'11\"","Male"],
  ["Nicklas Lidstrom","NHL defenseman legend","6'2\"","Male"],
  ["Peter Forsberg","NHL legend","6'0\"","Male"],
  ["Zlatan Ibrahimović","Soccer superstar","6'5\"","Male"],
  ["Didier Drogba","Chelsea FC legend, athlete","6'2\"","Male"],
  ["Peter Crouch","England soccer striker","6'7\"","Male"],
  ["Cristiano Ronaldo","Soccer GOAT candidate","6'2\"","Male"],
  ["Virgil van Dijk","Liverpool defender, athlete","6'4\"","Male"],
  ["Romelu Lukaku","Belgium soccer striker","6'3\"","Male"],
  ["Olivier Giroud","World Cup winner, athlete","6'4\"","Male"],
  ["Lionel Messi","Soccer GOAT","5'7\"","Male"],
  ["Neymar","Brazil soccer superstar","5'9\"","Male"],
  ["Kylian Mbappé","World Cup champion, athlete","5'10\"","Male"],
  ["Xavi","Spain and Barcelona legend","5'7\"","Male"],
  ["Andrés Iniesta","Spain and Barcelona legend","5'7\"","Male"],
  ["Ronaldinho","Brazil soccer legend","5'11\"","Male"],
  ["David Beckham","England soccer icon","6'0\"","Male"],
  ["Thierry Henry","Arsenal legend, athlete","6'2\"","Male"],
  ["Pelé","Brazil soccer legend","5'8\"","Male"],
  ["Zinedine Zidane","France World Cup legend","6'1\"","Male"],
  ["Luka Modrić","Croatia captain, Ballon d'Or","5'8\"","Male"],
  ["Roberto Carlos","Brazil defender","5'6\"","Male"],
  ["Paul Pogba","France World Cup champion","6'3\"","Male"],
  ["Gareth Bale","Wales soccer star","6'1\"","Male"],
  ["Robert Lewandowski","Poland soccer striker","6'1\"","Male"],
  ["Erling Haaland","Manchester City striker","6'4\"","Male"],
  ["Mohamed Salah","Liverpool winger, athlete","5'9\"","Male"],
  ["Sadio Mané","Senegal soccer star","5'9\"","Male"],
  ["Mia Hamm","US women's soccer legend","5'5\"","Female"],
  ["Abby Wambach","US women's soccer legend","5'11\"","Female"],
  ["Alex Morgan","US women's soccer star","5'7\"","Female"],
  ["Megan Rapinoe","US women's soccer champion","5'6\"","Female"],
  ["Christine Sinclair","Canada soccer legend","5'9\"","Female"],
  ["Carli Lloyd","US women's soccer champion","5'7\"","Female"],
  ["Hope Solo","US women's soccer goalkeeper","5'9\"","Female"],
  ["Brandi Chastain","US women's soccer champion","5'7\"","Female"],
  ["Ada Hegerberg","Ballon d'Or Féminin winner","5'11\"","Female"],
  ["Michael Phelps","Olympic gold medalist, swimming","6'4\"","Male"],
  ["Usain Bolt","Olympic gold medalist, fastest sprinter","6'5\"","Male"],
  ["Carl Lewis","9-time Olympic gold medalist, sprinter","6'2\"","Male"],
  ["Caitlyn Jenner","Trans activist, former Olympic decathlon champion","6'2\"","Trans"],
  ["Jesse Owens","4-time Olympic gold medalist","5'10\"","Male"],
  ["Mark Spitz","7-time Olympic gold medalist, swimmer","6'0\"","Male"],
  ["Nadia Comăneci","First perfect 10, Olympic gymnast","5'4\"","Female"],
  ["Mary Lou Retton","Olympic gymnastics champion","4'9\"","Female"],
  ["Florence Griffith-Joyner","3-time Olympic gold medalist sprinter","5'6\"","Female"],
  ["Jackie Joyner-Kersee","Olympic heptathlon champion","5'10\"","Female"],
  ["Greg Louganis","4-time Olympic gold medalist, diving","5'9\"","Male"],
  ["Brian Boitano","Olympic figure skating champion","5'11\"","Male"],
  ["Kristi Yamaguchi","Olympic figure skating champion","5'2\"","Female"],
  ["Apolo Ohno","8-time Olympic medalist, speed skating","5'10\"","Male"],
  ["Shaun White","3-time Olympic snowboarding champion","5'9\"","Male"],
  ["Bode Miller","Olympic alpine skiing champion","6'2\"","Male"],
  ["Lindsey Vonn","Olympic downhill skiing champion","5'10\"","Female"],
  ["Simone Biles","Most decorated Olympic gymnast","4'8\"","Female"],
  ["Gabby Douglas","Olympic gymnastics champion","5'0\"","Female"],
  ["Aly Raisman","Olympic gymnastics champion","5'2\"","Female"],
  ["Serena Williams","Tennis champion, 23 Grand Slams","5'9\"","Female"],
  ["Venus Williams","Tennis champion","6'1\"","Female"],
  ["Billie Jean King","Tennis legend, gender equality champion","5'4\"","Female"],
  ["Martina Navratilova","18-time Grand Slam champion","5'7\"","Female"],
  ["Chris Evert","18-time Grand Slam champion","5'6\"","Female"],
  ["Steffi Graf","22-time Grand Slam champion","5'9\"","Female"],
  ["Roger Federer","20-time Grand Slam champion","6'1\"","Male"],
  ["Rafael Nadal","22-time Grand Slam champion","6'1\"","Male"],
  ["Novak Djokovic","24-time Grand Slam champion","6'2\"","Male"],
  ["Pete Sampras","14-time Grand Slam champion","6'1\"","Male"],
  ["Andre Agassi","8-time Grand Slam champion","5'11\"","Male"],
  ["John McEnroe","7-time Grand Slam champion","5'11\"","Male"],
  ["Jimmy Connors","Tennis legend","5'10\"","Male"],
  ["Tony Hawk","Pro skateboarder, pop culture icon","6'3\"","Male"],
  ["Clint Eastwood","Actor, director, Hollywood icon","6'4\"","Male"],
  ["John Wayne","Hollywood Western icon, actor","6'4\"","Male"],
  ["Gary Cooper","Hollywood classic actor","6'3\"","Male"],
  ["James Stewart","Hollywood classic actor","6'3\"","Male"],
  ["Cary Grant","Hollywood golden age actor","6'1\"","Male"],
  ["Rock Hudson","Hollywood classic actor","6'5\"","Male"],
  ["Charlton Heston","Ben-Hur actor","6'3\"","Male"],
  ["Gregory Peck","To Kill a Mockingbird actor","6'3\"","Male"],
  ["Henry Fonda","Hollywood classic actor","6'1\"","Male"],
  ["Humphrey Bogart","Casablanca actor","5'8\"","Male"],
  ["Spencer Tracy","Hollywood classic actor","5'10\"","Male"],
  ["Marlon Brando","The Godfather actor","5'10\"","Male"],
  ["James Dean","Rebel Without a Cause actor","5'8\"","Male"],
  ["Marilyn Monroe","Hollywood icon, actress","5'5\"","Female"],
  ["Audrey Hepburn","Breakfast at Tiffany's actress","5'7\"","Female"],
  ["Grace Kelly","Classic actress, Princess of Monaco","5'7\"","Female"],
  ["Katharine Hepburn","4-time Oscar winning actress","5'7\"","Female"],
  ["Bette Davis","Hollywood classic actress","5'3\"","Female"],
  ["Joan Crawford","Hollywood classic actress","5'5\"","Female"],
  ["Ingrid Bergman","Casablanca actress, Oscar winner","5'9\"","Female"],
  ["Lauren Bacall","Hollywood classic actress","5'8\"","Female"],
  ["Rita Hayworth","Hollywood classic actress","5'6\"","Female"],
  ["Sophia Loren","Italian film legend, actress","5'9\"","Female"],
  ["Elizabeth Taylor","Hollywood icon, actress","5'2\"","Female"],
  ["Vivien Leigh","Gone with the Wind actress","5'3\"","Female"],
  ["Doris Day","Hollywood actress and singer","5'4\"","Female"],
  ["Dwayne Johnson","Actor, wrestler, producer","6'5\"","Male"],
  ["Chris Hemsworth","Thor actor","6'3\"","Male"],
  ["Chris Evans","Captain America actor","6'0\"","Male"],
  ["Chris Pratt","Guardians of the Galaxy actor","6'2\"","Male"],
  ["Henry Cavill","Superman actor","6'1\"","Male"],
  ["Ryan Reynolds","Deadpool actor","6'2\"","Male"],
  ["Jason Momoa","Aquaman actor","6'4\"","Male"],
  ["Michael B. Jordan","Creed actor","5'11\"","Male"],
  ["Idris Elba","Actor, musician","6'3\"","Male"],
  ["Mahershala Ali","Oscar-winning actor","6'2\"","Male"],
  ["Denzel Washington","Oscar-winning actor","6'0\"","Male"],
  ["Morgan Freeman","Oscar-winning actor","6'2\"","Male"],
  ["Samuel L. Jackson","Actor, Hollywood icon","6'2\"","Male"],
  ["Jeff Bridges","Oscar-winning actor","6'4\"","Male"],
  ["Tom Hanks","2-time Oscar winning actor","6'0\"","Male"],
  ["Tom Cruise","Action star, Mission Impossible actor","5'7\"","Male"],
  ["Brad Pitt","Oscar-winning actor","5'11\"","Male"],
  ["Leonardo DiCaprio","Oscar-winning actor","6'0\"","Male"],
  ["Johnny Depp","Pirates of the Caribbean actor","5'10\"","Male"],
  ["Will Smith","Oscar-winning actor","6'2\"","Male"],
  ["Eddie Murphy","Actor, comedian","5'9\"","Male"],
  ["Jim Carrey","Actor, comedian","6'2\"","Male"],
  ["Robin Williams","Actor, comedian","5'7\"","Male"],
  ["Bill Murray","Actor, comedian","6'2\"","Male"],
  ["John Belushi","SNL comedian, actor","5'8\"","Male"],
  ["Chevy Chase","SNL comedian, actor","6'4\"","Male"],
  ["Dan Aykroyd","SNL comedian, Ghostbusters actor","6'1\"","Male"],
  ["Steve Martin","Comedian, actor, writer","5'10\"","Male"],
  ["Martin Short","Comedian, actor","5'7\"","Male"],
  ["Mel Brooks","Comedian, director","5'5\"","Male"],
  ["Gene Wilder","Willy Wonka actor","5'11\"","Male"],
  ["Peter Sellers","Dr. Strangelove actor","5'8\"","Male"],
  ["Jack Nicholson","3-time Oscar winning actor","5'9\"","Male"],
  ["Al Pacino","Godfather actor","5'7\"","Male"],
  ["Robert De Niro","2-time Oscar winning actor","5'10\"","Male"],
  ["Dustin Hoffman","2-time Oscar winning actor","5'6\"","Male"],
  ["Sylvester Stallone","Rocky, Rambo actor","5'9\"","Male"],
  ["Arnold Schwarzenegger","Terminator actor, Governor","6'2\"","Male"],
  ["Bruce Willis","Die Hard actor","6'0\"","Male"],
  ["Harrison Ford","Han Solo, Indiana Jones actor","6'1\"","Male"],
  ["Mark Hamill","Luke Skywalker actor","5'9\"","Male"],
  ["Carrie Fisher","Princess Leia actress","5'1\"","Female"],
  ["Mel Gibson","Braveheart director, actor","5'9\"","Male"],
  ["Russell Crowe","Oscar-winning actor","5'11\"","Male"],
  ["Hugh Jackman","Wolverine actor","6'2\"","Male"],
  ["Christian Bale","Oscar-winning actor","6'0\"","Male"],
  ["Heath Ledger","Oscar-winning actor, Joker","6'1\"","Male"],
  ["Joaquin Phoenix","Oscar-winning actor","5'8\"","Male"],
  ["Jared Leto","Oscar-winning actor, musician","5'9\"","Male"],
  ["Gary Oldman","Oscar-winning actor","5'9\"","Male"],
  ["Daniel Day-Lewis","3-time Oscar winning actor","6'1\"","Male"],
  ["Anthony Hopkins","Oscar-winning actor","5'8\"","Male"],
  ["Ian McKellen","Gandalf actor","5'11\"","Male"],
  ["Patrick Stewart","Captain Picard, Professor X actor","5'10\"","Male"],
  ["Sean Connery","Original James Bond actor","6'2\"","Male"],
  ["Daniel Craig","James Bond actor","5'10\"","Male"],
  ["Pierce Brosnan","James Bond actor","6'1\"","Male"],
  ["Timothy Dalton","James Bond actor","6'2\"","Male"],
  ["Roger Moore","James Bond actor","6'1\"","Male"],
  ["Liam Neeson","Taken actor","6'4\"","Male"],
  ["Keanu Reeves","Neo in The Matrix actor","6'1\"","Male"],
  ["Nicolas Cage","Oscar-winning actor","6'0\"","Male"],
  ["John Travolta","Saturday Night Fever actor","6'2\"","Male"],
  ["Alec Baldwin","30 Rock actor, SNL","6'2\"","Male"],
  ["Paul Newman","Hollywood legend, actor","5'9\"","Male"],
  ["Robert Redford","Hollywood legend, actor","5'10\"","Male"],
  ["Steve McQueen","Hollywood icon, actor","5'10\"","Male"],
  ["Gene Hackman","Oscar-winning actor","6'2\"","Male"],
  ["Jon Voight","Oscar-winning actor","6'0\"","Male"],
  ["Sigourney Weaver","Alien actress","5'11\"","Female"],
  ["Meryl Streep","3-time Oscar winning actress","5'6\"","Female"],
  ["Cate Blanchett","2-time Oscar winning actress","5'8\"","Female"],
  ["Jodie Foster","2-time Oscar winning actress","5'3\"","Female"],
  ["Helen Mirren","Oscar-winning actress","5'4\"","Female"],
  ["Judi Dench","Oscar-winning actress","5'1\"","Female"],
  ["Diane Keaton","Oscar-winning actress","5'7\"","Female"],
  ["Faye Dunaway","Oscar-winning actress","5'7\"","Female"],
  ["Jane Fonda","2-time Oscar winning actress","5'8\"","Female"],
  ["Susan Sarandon","Oscar-winning actress","5'7\"","Female"],
  ["Geena Davis","Oscar-winning actress","6'0\"","Female"],
  ["Sharon Stone","Basic Instinct actress","5'8\"","Female"],
  ["Demi Moore","Ghost actress","5'5\"","Female"],
  ["Julia Roberts","Oscar-winning actress","5'9\"","Female"],
  ["Sandra Bullock","Oscar-winning actress","5'7\"","Female"],
  ["Halle Berry","Oscar-winning actress","5'5\"","Female"],
  ["Charlize Theron","Oscar-winning actress","5'10\"","Female"],
  ["Nicole Kidman","Oscar-winning actress","5'11\"","Female"],
  ["Angelina Jolie","Oscar-winning actress","5'7\"","Female"],
  ["Jennifer Aniston","Friends actress","5'5\"","Female"],
  ["Reese Witherspoon","Oscar-winning actress","5'2\"","Female"],
  ["Jennifer Lawrence","Oscar-winning actress","5'9\"","Female"],
  ["Emma Stone","Oscar-winning actress","5'6\"","Female"],
  ["Natalie Portman","Oscar-winning actress","5'3\"","Female"],
  ["Scarlett Johansson","Black Widow actress","5'3\"","Female"],
  ["Lupita Nyong'o","Oscar-winning actress","5'5\"","Female"],
  ["Viola Davis","Oscar-winning actress","5'5\"","Female"],
  ["Octavia Spencer","Oscar-winning actress","5'1\"","Female"],
  ["Whoopi Goldberg","EGOT winner, actress","5'6\"","Female"],
  ["Kathy Bates","Oscar-winning actress","5'3\"","Female"],
  ["Bette Midler","Actress, singer","5'1\"","Female"],
  ["Goldie Hawn","Oscar-winning actress","5'6\"","Female"],
  ["Lily Tomlin","Actress, comedian","5'6\"","Female"],
  ["Cher","Actress, pop singer","5'9\"","Female"],
  ["Dolly Parton","Country music singer, actress","5'1\"","Female"],
  ["Barbra Streisand","EGOT winner, actress, singer","5'5\"","Female"],
  ["Liza Minnelli","Oscar-winning actress, singer","5'4\"","Female"],
  ["Judy Garland","Wizard of Oz actress","4'11\"","Female"],
  ["Shirley Temple","Child actress icon","5'2\"","Female"],
  ["Ginger Rogers","Classic actress, dancer","5'4\"","Female"],
  ["Bruce Lee","Martial arts icon, actor","5'7\"","Male"],
  ["Jackie Chan","Martial arts action star, actor","5'8\"","Male"],
  ["Jet Li","Martial arts action star, actor","5'6\"","Male"],
  ["Chadwick Boseman","Black Panther actor","6'0\"","Male"],
  ["Viggo Mortensen","Aragorn in LOTR actor","5'11\"","Male"],
  ["Orlando Bloom","Legolas in LOTR actor","5'11\"","Male"],
  ["Elijah Wood","Frodo in LOTR actor","5'6\"","Male"],
  ["Hugo Weaving","Agent Smith in Matrix actor","6'2\"","Male"],
  ["Laurence Fishburne","Morpheus in Matrix actor","6'0\"","Male"],
  ["Carrie-Anne Moss","Trinity in Matrix actress","5'10\"","Female"],
  ["Uma Thurman","Kill Bill actress","5'11\"","Female"],
  ["Lucy Liu","Kill Bill actress","5'3\"","Female"],
  ["Daryl Hannah","Splash, Kill Bill actress","5'10\"","Female"],
  ["Pam Grier","Blaxploitation icon, Jackie Brown actress","5'8\"","Female"],
  ["Linda Hamilton","Sarah Connor in Terminator actress","5'7\"","Female"],
  ["Jamie Lee Curtis","Halloween actress","5'7\"","Female"],
  ["Sissy Spacek","Carrie actress","5'2\"","Female"],
  ["Shelley Duvall","The Shining actress","5'6\"","Female"],
  ["Jeff Goldblum","Jurassic Park actor","6'4\"","Male"],
  ["John Goodman","The Big Lebowski actor","6'2\"","Male"],
  ["Steve Buscemi","Fargo, Reservoir Dogs actor","5'9\"","Male"],
  ["Harvey Keitel","Pulp Fiction actor","5'9\"","Male"],
  ["Tim Roth","Pulp Fiction actor","5'7\"","Male"],
  ["Michael Madsen","Reservoir Dogs actor","6'2\"","Male"],
  ["Christopher Walken","Oscar-winning actor","6'1\"","Male"],
  ["John Malkovich","Actor, director","6'0\"","Male"],
  ["Willem Dafoe","Oscar-nominated actor","5'9\"","Male"],
  ["Benicio del Toro","Oscar-winning actor","6'2\"","Male"],
  ["Javier Bardem","Oscar-winning actor","6'0\"","Male"],
  ["Antonio Banderas","Desperado actor","5'9\"","Male"],
  ["Danny DeVito","Actor, director","4'10\"","Male"],
  ["Peter Dinklage","Game of Thrones actor","4'5\"","Male"],
  ["Warwick Davis","Willow, Star Wars actor","3'6\"","Male"],
  ["Verne Troyer","Mini-Me in Austin Powers actor","2'8\"","Male"],
  ["Bryan Cranston","Breaking Bad actor","5'11\"","Male"],
  ["Aaron Paul","Breaking Bad actor","5'8\"","Male"],
  ["James Gandolfini","Sopranos actor","5'11\"","Male"],
  ["David Bowie","Rock musician, actor","6'0\"","Male"],
  ["Mick Jagger","Rolling Stones frontman, singer","5'10\"","Male"],
  ["Keith Richards","Rolling Stones guitarist","5'10\"","Male"],
  ["Paul McCartney","Beatles singer, songwriter","5'11\"","Male"],
  ["John Lennon","Beatles singer, legend","5'11\"","Male"],
  ["George Harrison","Beatles guitarist","5'11\"","Male"],
  ["Ringo Starr","Beatles drummer","5'8\"","Male"],
  ["Elvis Presley","The King of Rock n Roll, singer","6'0\"","Male"],
  ["Bob Dylan","Nobel Prize-winning singer-songwriter","5'7\"","Male"],
  ["Bob Marley","Reggae singer, legend","5'10\"","Male"],
  ["Jimi Hendrix","Guitar legend, rock musician","5'11\"","Male"],
  ["Janis Joplin","Rock and blues singer","5'1\"","Female"],
  ["Tina Turner","Rock singer, icon","5'4\"","Female"],
  ["Diana Ross","Motown singer, legend","5'4\"","Female"],
  ["Aretha Franklin","Queen of Soul, singer","5'6\"","Female"],
  ["Whitney Houston","Pop singer, legend","5'8\"","Female"],
  ["Michael Jackson","King of Pop, singer","5'9\"","Male"],
  ["Prince","Singer, musician, icon","5'2\"","Male"],
  ["Madonna","Pop singer, icon","5'4\"","Female"],
  ["Janet Jackson","Pop singer, icon","5'4\"","Female"],
  ["Stevie Wonder","Motown singer, musician","5'11\"","Male"],
  ["Ray Charles","Singer, musician, legend","5'11\"","Male"],
  ["Johnny Rotten / John Lydon","Sex Pistols, PiL punk frontman","5'7\"","Male"],
  ["Joe Strummer","The Clash punk frontman","5'8\"","Male"],
  ["Mick Jones","The Clash guitarist","5'9\"","Male"],
  ["Paul Simonon","The Clash bassist","6'0\"","Male"],
  ["Henry Rollins","Black Flag, Rollins Band frontman","5'9\"","Male"],
  ["Greg Ginn","Black Flag guitarist","6'0\"","Male"],
  ["Jello Biafra","Dead Kennedys punk frontman","6'2\"","Male"],
  ["Ian MacKaye","Minor Threat, Fugazi punk frontman","6'0\"","Male"],
  ["Glenn Danzig","Misfits, Danzig punk frontman","5'4\"","Male"],
  ["Joey Ramone","Ramones punk frontman","6'6\"","Male"],
  ["Johnny Ramone","Ramones guitarist","5'9\"","Male"],
  ["Dee Dee Ramone","Ramones bassist","5'10\"","Male"],
  ["Kurt Cobain","Nirvana frontman, singer","5'9\"","Male"],
  ["Dave Grohl","Nirvana drummer, Foo Fighters frontman","6'0\"","Male"],
  ["Krist Novoselic","Nirvana bassist","6'7\"","Male"],
  ["Eddie Vedder","Pearl Jam frontman, singer","5'7\"","Male"],
  ["Chris Cornell","Soundgarden, Audioslave rock frontman","6'2\"","Male"],
  ["Layne Staley","Alice in Chains frontman","5'11\"","Male"],
  ["Scott Weiland","Stone Temple Pilots frontman","5'9\"","Male"],
  ["Billy Corgan","Smashing Pumpkins frontman","6'3\"","Male"],
  ["Trent Reznor","Nine Inch Nails frontman, musician","5'7\"","Male"],
  ["Marilyn Manson","Industrial rock frontman, musician","6'1\"","Male"],
  ["Anthony Kiedis","Red Hot Chili Peppers frontman","5'9\"","Male"],
  ["Flea","Red Hot Chili Peppers bassist","5'8\"","Male"],
  ["Thom Yorke","Radiohead frontman, singer","5'5\"","Male"],
  ["Jonny Greenwood","Radiohead guitarist","6'0\"","Male"],
  ["Robert Smith","The Cure frontman, singer","5'8\"","Male"],
  ["Morrissey","The Smiths frontman, singer","6'0\"","Male"],
  ["Johnny Marr","The Smiths guitarist","5'10\"","Male"],
  ["Ian Curtis","Joy Division punk frontman","5'8\"","Male"],
  ["Bernard Sumner","New Order frontman, musician","5'9\"","Male"],
  ["Siouxsie Sioux","Siouxsie and the Banshees punk singer","5'7\"","Female"],
  ["Debbie Harry","Blondie punk frontwoman, singer","5'7\"","Female"],
  ["Joan Jett","Punk rock singer, guitarist","5'3\"","Female"],
  ["Chrissie Hynde","The Pretenders frontwoman, singer","5'5\"","Female"],
  ["Kim Gordon","Sonic Youth frontwoman, musician","5'9\"","Female"],
  ["Kim Deal","Pixies bassist, singer","5'4\"","Female"],
  ["PJ Harvey","Punk and alternative singer","5'6\"","Female"],
  ["Kathleen Hanna","Bikini Kill, Le Tigre punk frontwoman","5'4\"","Female"],
  ["Courtney Love","Hole punk frontwoman, singer","5'4\"","Female"],
  ["Shirley Manson","Garbage frontwoman, singer","5'8\"","Female"],
  ["Gwen Stefani","No Doubt frontwoman, singer","5'6\"","Female"],
  ["Alanis Morissette","Alt rock singer","5'4\"","Female"],
  ["Liz Phair","Indie rock singer, musician","5'7\"","Female"],
  ["Tanya Donelly","Belly, Throwing Muses singer","5'6\"","Female"],
  ["Michael Stipe","R.E.M. frontman, singer","5'9\"","Male"],
  ["Peter Buck","R.E.M. guitarist","5'10\"","Male"],
  ["Bono","U2 frontman, singer","5'7\"","Male"],
  ["The Edge","U2 guitarist","5'8\"","Male"],
  ["Gavin Rossdale","Bush frontman, rock singer","5'11\"","Male"],
  ["Damon Albarn","Blur, Gorillaz frontman, musician","5'10\"","Male"],
  ["Noel Gallagher","Oasis guitarist, singer","5'8\"","Male"],
  ["Liam Gallagher","Oasis frontman, singer","5'10\"","Male"],
  ["Jarvis Cocker","Pulp frontman, singer","6'1\"","Male"],
  ["Brett Anderson","Suede frontman, singer","5'11\"","Male"],
  ["Evan Dando","The Lemonheads frontman, singer","6'0\"","Male"],
  ["Mark Lanegan","Screaming Trees frontman, singer","6'2\"","Male"],
  ["Mike Patton","Faith No More, Mr. Bungle singer","5'11\"","Male"],
  ["Maynard James Keenan","Tool frontman, singer","5'7\"","Male"],
  ["Perry Farrell","Jane's Addiction frontman, singer","5'10\"","Male"],
  ["Dave Navarro","Jane's Addiction guitarist","5'8\"","Male"],
  ["Zack de la Rocha","Rage Against the Machine rapper, singer","5'8\"","Male"],
  ["Tom Morello","Rage Against the Machine guitarist","6'0\"","Male"],
  ["Tim Armstrong","Rancid punk frontman","5'8\"","Male"],
  ["Lars Frederiksen","Rancid guitarist","6'0\"","Male"],
  ["Billie Joe Armstrong","Green Day punk frontman","5'7\"","Male"],
  ["Tre Cool","Green Day drummer","5'10\"","Male"],
  ["Fat Mike","NOFX punk frontman","5'11\"","Male"],
  ["Dexter Holland","The Offspring punk frontman","5'11\"","Male"],
  ["Tom DeLonge","Blink-182 guitarist, singer","6'1\"","Male"],
  ["Mark Hoppus","Blink-182 bassist, singer","5'11\"","Male"],
  ["Travis Barker","Blink-182 drummer","5'10\"","Male"],
  ["Stiv Bators","Dead Boys punk frontman","5'7\"","Male"],
  ["Poly Styrene","X-Ray Spex punk frontwoman","5'6\"","Female"],
  ["Exene Cervenka","X punk frontwoman","5'5\"","Female"],
  ["Patti Smith","Punk poet, singer","5'7\"","Female"],
  ["Suzi Quatro","Proto-punk rock singer","5'1\"","Female"],
  ["Nina Hagen","Punk singer","5'5\"","Female"],
  ["Stephen King","Horror novelist, author","6'2\"","Male"],
  ["J.K. Rowling","Harry Potter author","5'5\"","Female"],
  ["Toni Morrison","Nobel Prize-winning novelist","5'6\"","Female"],
  ["Ernest Hemingway","Nobel Prize-winning novelist","6'0\"","Male"],
  ["John Steinbeck","Nobel Prize-winning novelist","6'1\"","Male"],
  ["F. Scott Fitzgerald","The Great Gatsby author","5'8\"","Male"],
  ["Mark Twain","American literary icon, author","5'8\"","Male"],
  ["Jack Kerouac","On the Road author","5'8\"","Male"],
  ["Hunter S. Thompson","Gonzo journalist, author","6'3\"","Male"],
  ["Kurt Vonnegut","Slaughterhouse-Five author","6'2\"","Male"],
  ["Philip Roth","Pulitzer Prize-winning novelist","5'10\"","Male"],
  ["Gore Vidal","Novelist, essayist","6'1\"","Male"],
  ["Truman Capote","In Cold Blood author","5'3\"","Male"],
  ["Norman Mailer","Pulitzer Prize-winning novelist","5'8\"","Male"],
  ["Salman Rushdie","Booker Prize-winning novelist","5'7\"","Male"],
  ["Gabriel García Márquez","Nobel Prize-winning novelist","5'7\"","Male"],
  ["Jorge Luis Borges","Argentine literary master, author","5'6\"","Male"],
  ["Umberto Eco","Name of the Rose author","5'9\"","Male"],
  ["Haruki Murakami","Japanese literary novelist","5'8\"","Male"],
  ["Kazuo Ishiguro","Nobel Prize-winning novelist","5'11\"","Male"],
  ["Ian McEwan","Booker Prize-winning novelist","5'8\"","Male"],
  ["Donna Tartt","The Secret History author","5'0\"","Female"],
  ["Cormac McCarthy","No Country for Old Men author","5'8\"","Male"],
  ["Don DeLillo","White Noise author","5'9\"","Male"],
  ["David Foster Wallace","Infinite Jest author","5'11\"","Male"],
  ["Chuck Palahniuk","Fight Club author","5'11\"","Male"],
  ["Bret Easton Ellis","American Psycho author","5'9\"","Male"],
  ["Douglas Adams","Hitchhiker's Guide author","6'4\"","Male"],
  ["Terry Pratchett","Discworld author","5'7\"","Male"],
  ["Neil Gaiman","American Gods author","5'11\"","Male"],
  ["George R.R. Martin","Game of Thrones author","5'8\"","Male"],
  ["Anne Rice","Interview with the Vampire author","5'5\"","Female"],
  ["Ursula K. Le Guin","Sci-fi and fantasy novelist","5'5\"","Female"],
  ["Octavia Butler","Sci-fi novelist, MacArthur Fellow","5'9\"","Female"],
  ["Margaret Atwood","Handmaid's Tale author","5'5\"","Female"],
  ["Joyce Carol Oates","Prolific novelist, author","5'2\"","Female"],
  ["Maya Angelou","Poet, memoirist, author","6'0\"","Female"],
  ["Alice Walker","Pulitzer Prize-winning novelist","5'3\"","Female"],
  ["Amy Tan","Joy Luck Club author","4'11\"","Female"],
  ["Judy Blume","YA literary icon, author","5'3\"","Female"],
  ["Agatha Christie","Mystery novelist, author","5'7\"","Female"],
  ["Virginia Woolf","Modernist literary novelist","5'7\"","Female"],
  ["Sylvia Plath","The Bell Jar poet, author","5'9\"","Female"],
  ["James Baldwin","Go Tell It on the Mountain author","5'7\"","Male"],
  ["Ralph Ellison","Invisible Man author","5'10\"","Male"],
  ["Langston Hughes","Harlem Renaissance poet, author","5'9\"","Male"],
  ["Laverne Cox","Orange is the New Black actress","5'11\"","Trans"],
  ["Janet Mock","Writer, activist, director","5'6\"","Trans"],
  ["Chaz Bono","Activist, musician, son of Cher","5'5\"","Trans"],
  ["Lana Wachowski","Matrix director, filmmaker","5'10\"","Trans"],
  ["Lily Wachowski","Matrix director, filmmaker","5'11\"","Trans"],
  ["Kim Petras","Pop singer","5'4\"","Trans"],
  ["Hunter Schafer","Euphoria actress, model","5'10\"","Trans"],
  ["MJ Rodriguez","Pose actress","5'4\"","Trans"],
  ["Indya Moore","Pose actress","5'7\"","Trans"],
  ["Ts Madison","Actress, media personality","5'9\"","Trans"],
  ["Alexandra Billings","Transparent actress","5'7\"","Trans"],
  ["Rebecca Root","British actress","5'9\"","Trans"],
  ["Nicole Maines","Supergirl actress","5'5\"","Trans"],
  ["Jazz Jennings","Trans activist, TV personality","5'5\"","Trans"],
  ["Christine Jorgensen","Pioneer trans celebrity","5'10\"","Trans"],
  ["Wendy Carlos","Electronic music pioneer, musician","5'7\"","Trans"],
  ["Trace Lysette","Transparent actress","5'9\"","Trans"],
  ["Hari Nef","Actress, model","5'10\"","Trans"],
];

const seen = new Set();
const INITIAL = CELEBS_RAW
  .map(([name, fame, height, gender]) => ({
    name, fame, height, gender,
    inches: toInches(height),
    fav: false,
    cat: getCategory(fame),
  }))
  .filter(c => { if (seen.has(c.name)) return false; seen.add(c.name); return true; })
  .sort((a, b) => b.inches - a.inches);

function Card({ c, onFav, onDelete, confirmDelete, setConfirmDelete }) {
  const gs = GENDER_STYLES[c.gender] || GENDER_STYLES.Male;
  const cs = CAT_COLORS[c.cat] || CAT_COLORS.Other;
  return (
    <div style={{background:"white",border:"1px solid #e5e7eb",borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",gap:12,marginBottom:7}}>
      <button onClick={() => onFav(c.name)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,padding:0,lineHeight:1,color:c.fav?"#f59e0b":"#d1d5db",flexShrink:0}}>
        {c.fav ? "★" : "☆"}
      </button>
      <div style={{minWidth:34,height:34,borderRadius:"50%",background:gs.bg,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:500,fontSize:11,color:gs.color,flexShrink:0}}>
        {c.gender === "Trans" ? "T" : c.gender === "Female" ? "F" : "M"}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
          <span style={{fontWeight:500,fontSize:14,color:"#111"}}>{c.name}</span>
          <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:cs.bg,color:cs.color,fontWeight:500,flexShrink:0,whiteSpace:"nowrap"}}>{c.cat}</span>
        </div>
        <div style={{fontSize:12,color:"#9ca3af",marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.fame}</div>
      </div>
      <div style={{textAlign:"right",flexShrink:0,marginRight:6}}>
        <div style={{fontWeight:600,fontSize:15,color:"#111"}}>{c.height}</div>
        <div style={{fontSize:11,color:"#9ca3af",marginTop:1}}>{c.inches === HEIDI_INCHES ? "same as Heidi" : diffLabel(c.inches)}</div>
      </div>
      {confirmDelete === c.name ? (
        <div style={{display:"flex",gap:4,flexShrink:0}}>
          <button onClick={() => onDelete(c.name)} style={{padding:"4px 10px",fontSize:12,background:"#fee2e2",color:"#dc2626",border:"1px solid #fca5a5",borderRadius:6,cursor:"pointer",fontFamily:"inherit"}}>Delete</button>
          <button onClick={() => setConfirmDelete(null)} style={{padding:"4px 8px",fontSize:12,background:"#f3f4f6",color:"#6b7280",border:"1px solid #e5e7eb",borderRadius:6,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setConfirmDelete(c.name)} style={{background:"none",border:"none",cursor:"pointer",color:"#d1d5db",fontSize:18,padding:"0 2px",flexShrink:0,lineHeight:1,fontFamily:"inherit"}}>✕</button>
      )}
    </div>
  );
}

export default function App() {
  const [celebs, setCelebs] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const [addName, setAddName] = useState("");
  const [addInfo, setAddInfo] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => {
    let list = celebs;
    if (catFilter === "Favorites") list = list.filter(c => c.fav);
    else if (catFilter !== "All") list = list.filter(c => c.cat === catFilter);
    if (genderFilter !== "All") list = list.filter(c => c.gender === genderFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.fame.toLowerCase().includes(q));
    }
    return list;
  }, [celebs, search, genderFilter, catFilter]);

  const taller = filtered.filter(c => c.inches > HEIDI_INCHES);
  const shorter = filtered.filter(c => c.inches <= HEIDI_INCHES);
  const favCount = celebs.filter(c => c.fav).length;

  const toggleFav = name => setCelebs(prev => prev.map(c => c.name === name ? { ...c, fav: !c.fav } : c));
  const removeceleb = name => { setCelebs(prev => prev.filter(c => c.name !== name)); setConfirmDelete(null); };

  async function handleAdd() {
    if (!addName.trim()) { setAddError("Please enter a name."); return; }
    setAdding(true); setAddError("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          messages: [{
            role: "user",
            content: `You are a celebrity height database. Return ONLY a JSON object:\n- name: string\n- fame: string (max 8 words, include job keyword like actor/actress/singer/guitarist/bassist/drummer/novelist/author/poet/athlete/Olympic)\n- height: string (e.g. 5'9")\n- gender: "Male", "Female", or "Trans"\n- found: boolean\n\nCelebrity: ${addName.trim()}\nExtra info: ${addInfo.trim() || "none"}\n\nReturn ONLY the JSON.`
          }]
        })
      });
      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("").trim().replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(raw);
      if (!parsed.found) { setAddError(`Couldn't find "${addName}". Try adding more info.`); setAdding(false); return; }
      const newC = {
        name: parsed.name, fame: parsed.fame, height: parsed.height,
        gender: parsed.gender, inches: toInches(parsed.height),
        fav: false, cat: getCategory(parsed.fame),
      };
      setCelebs(prev => {
        if (prev.find(c => c.name.toLowerCase() === newC.name.toLowerCase())) {
          setAddError(`${newC.name} is already in the list!`); return prev;
        }
        return [...prev, newC].sort((a, b) => b.inches - a.inches);
      });
      setAddName(""); setAddInfo(""); setShowAdd(false);
    } catch { setAddError("Error looking up celebrity. Please try again."); }
    setAdding(false);
  }

  return (
    <div style={{maxWidth:720,margin:"0 auto",padding:"20px 16px",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16,gap:8}}>
        <div>
          <h1 style={{margin:0,fontSize:28,fontWeight:700,color:"#111"}}>How Tall</h1>
          <p style={{margin:"4px 0 0",fontSize:12,color:"#9ca3af"}}>
            {celebs.length} celebrities • compared to Heidi (5'10.5"){favCount > 0 ? ` • ${favCount} favorited` : ""}
          </p>
        </div>
        <button onClick={() => setShowAdd(p => !p)} style={{padding:"9px 16px",fontWeight:500,fontSize:13,borderRadius:8,border:"1px solid #e5e7eb",background:showAdd?"#f3f4f6":"white",cursor:"pointer",flexShrink:0,fontFamily:"inherit"}}>
          {showAdd ? "✕ Cancel" : "+ Add celebrity"}
        </button>
      </div>

      {showAdd && (
        <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:12,padding:16,marginBottom:16}}>
          <div style={{fontWeight:500,fontSize:14,marginBottom:10,color:"#111"}}>Add a celebrity</div>
          <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
            <input value={addName} onChange={e => setAddName(e.target.value)} placeholder="Name (e.g. Taylor Swift)" style={{flex:"1 1 150px"}} onKeyDown={e => e.key === "Enter" && handleAdd()} />
            <input value={addInfo} onChange={e => setAddInfo(e.target.value)} placeholder="Optional: singer, actress..." style={{flex:"1 1 150px"}} onKeyDown={e => e.key === "Enter" && handleAdd()} />
            <button onClick={handleAdd} disabled={adding} style={{padding:"8px 20px",fontWeight:500,fontSize:13,borderRadius:8,border:"none",background:adding?"#e5e7eb":"#111",color:adding?"#9ca3af":"white",cursor:adding?"not-allowed":"pointer",fontFamily:"inherit"}}>
              {adding ? "Looking up..." : "Add"}
            </button>
          </div>
          {addError && <div style={{fontSize:12,color:"#dc2626",marginTop:4}}>{addError}</div>}
          <div style={{fontSize:11,color:"#9ca3af",marginTop:6}}>Claude will look up their height, category, and gender automatically.</div>
        </div>
      )}

      <div style={{marginBottom:12}}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or description..."
          style={{width:"100%",padding:"9px 14px",borderRadius:10,border:"1px solid #e5e7eb",fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:10}}
        />
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCatFilter(c)} style={btn(catFilter===c, CAT_BTN_COLORS[c])}>
              {c === "Favorites" ? `★ Favorites${favCount > 0 ? ` (${favCount})` : ""}` : c}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {GENDERS.map(g => (
            <button key={g} onClick={() => setGenderFilter(g)} style={btn(genderFilter===g, "#374151")}>{g}</button>
          ))}
        </div>
      </div>

      <div style={{fontSize:12,color:"#9ca3af",marginBottom:10}}>Showing {filtered.length} of {celebs.length}</div>

      {taller.map(c => (
        <Card key={c.name} c={c} onFav={toggleFav} onDelete={removeceleb}
          confirmDelete={confirmDelete} setConfirmDelete={setConfirmDelete} />
      ))}

      <div style={{display:"flex",alignItems:"center",gap:12,margin:"20px 0"}}>
        <div style={{flex:1,height:1,background:"#e5e7eb"}} />
        <div style={{fontSize:12,fontWeight:500,color:"#6b7280",background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:20,padding:"5px 16px",whiteSpace:"nowrap"}}>
          Shorter than Heidi (5'10.5")
        </div>
        <div style={{flex:1,height:1,background:"#e5e7eb"}} />
      </div>

      {shorter.map(c => (
        <Card key={c.name} c={c} onFav={toggleFav} onDelete={removeceleb}
          confirmDelete={confirmDelete} setConfirmDelete={setConfirmDelete} />
      ))}

      {filtered.length === 0 && (
        <div style={{textAlign:"center",padding:"2rem",color:"#9ca3af",fontSize:14}}>No celebrities match your filters.</div>
      )}
    </div>
  );
}
