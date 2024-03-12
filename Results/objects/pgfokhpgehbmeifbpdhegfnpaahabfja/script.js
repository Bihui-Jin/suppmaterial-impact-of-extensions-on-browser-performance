
async function fetchSourceScoreAsync (url) {
  let fetchresponse = await fetch(url);
  let raw_data = await fetchresponse.json();
  let domain = await raw_data[0].domain
  let name = await raw_data[0].name
  let bias = await raw_data[0].bias
  let score = await  raw_data[0].score
  let country = await raw_data[0].country
  let summary = await raw_data[0].summary
  let link = await raw_data[0].link
  let history = await raw_data[0].history
  let ownership = await raw_data[0].ownership
  return [domain, name, bias, score, country, summary, link, history, ownership]
}

async function fetchArticleScoreAsync (link) {
  let fetchresponse = await fetch(link);
  let raw_data = await fetchresponse.json();
  let url = await raw_data[0].url
  let clusterid = await raw_data[0].clusterid
  let overall_score = await raw_data[0].overall_score
  let overall_summary = await raw_data[0].overall_summary
  let source_score_text = await raw_data[0].source_score_text
  let source_summary = await raw_data[0].source_summary
  let author_score_text = await raw_data[0].author_score_text
  let author_summary = await raw_data[0].author_summary
  let ref_score_text = await raw_data[0].ref_score_text
  let ref_summary = await raw_data[0].ref_summary
  let claims_score_text = await raw_data[0].claims_score
  let claims_summary = await raw_data[0].claims_summary
  let pir_score_text = await raw_data[0].pir_score
  let pir_summary = await raw_data[0].pir_summary
  return [url, clusterid, overall_score, overall_summary, source_score_text, source_summary, author_score_text, author_summary, ref_score_text, ref_summary, claims_score_text, claims_summary, pir_score_text, pir_summary]
}


var article_list = [];
var valid_sources = ['altrighttv.com','kompas.com','100percentfedup.com','10news.one','10tv.com','12minutos.com','12news.com','12newsnow.com','13abc.com','13newsnow.com','13wham.com','19fortyfive.com','19thnews.org','21stcenturywire.com','247wallst.com','24ur.com','2ndvote.com','369news.net','38north.org','3ccorp.net','604now.com','680news.com','79days.news','7news.com.au','911truth.org','972mag.com','9news.com','9news.com.au','a1apac.org','aa.com.tr','aaas.org','aap.org','aapsonline.org','aawsat.com','abc.es','abc.net.au','abc11.com','abc12.com','abc4.com','abc7chicago.com','abc7ny.com','abcbusinessnews.com','abort73.com','abovethelaw.com','abovetopsecret.com','abqjournal.com','abs-cbn.com','ac2news.com','academia.org','acallforanuprising.com','aceshowbiz.com','rockislandtoday.com','achnews.org','aclj.org','aclu.org','acpeds.org','acsh.org','act.tv','acting-man.com','actionnews3.com','actionnewsjax.com','activistpost.com','ad.nl','adaa.org','adamscountytimes.com','adareporter.com','additudemag.com','adelaidenow.com.au','adflegal.org','adfontesmedia.com','adl.org','adn.com','adobochronicles.com','advocate.com','adweek.com','ae911truth.org','aei.org','aeon.co','afa.net','affinitymagazine.us','afj.org','afp.com','afpc.org','afr.com','africacheck.org','africanarguments.org','africanews.com','africanexponent.com','aftonbladet.se','agdaily.com','ageofautism.com','agerpres.ro','agu.org','agweb.com','ahram.org.eg','ahvalnews.com','aidc.org.za','aier.org','aim.org','aim4truth.org','aina.org','aip.org','airforcetimes.com','airspacemag.com','airwars.org','aish.com','ajaonline.org','ajc.com','ajuanews.com','al-monitor.com','al-sura.com','al.com','alarabiya.net','alaraby.co.uk','alaskasnewssource.com','albanystandard.com','albawaba.com','albertapressleader.ca','albertaviews.ca','aldianews.com','alec.org','aleteia.org','algemeiner.com','aljazeera.com','allafrica.com','allgov.com','allianceforadvancedhealth.com','halfwaypost.com','allnewspipeline.com','almanar.com.lb','almasdarnews.com','alphanewsmn.com','alreporter.com','alternative-science.com','alternativelyfacts.com','alternativenews.com','alternet.org','althealthworks.com','altnews.in','altnewsmedia.net','altoday.com','altright.com','ama-assn.org','amac.us','amarillo.com','americablog.com','americadaily.com','americafirstpolicy.com','americamagazine.org','americanactionforum.org','americanactionnews.com','americanaffairsjournal.org','americanbridgepac.org','americanconsequences.com','americanconservativemedia.com','americanconservativemovement.com','americandigitalnews.com','americanexperiment.org','americanfirearms.org','americanfreepress.net','americanheritage.com','americanimmigrationcouncil.org','americanindependent.com','americanlibertyemail.com','americanlookout.com','americanmilitarynews.com','americanmind.org','americanoversight.org','americanpatriotdaily.com','americanpeopledaily.com','americanpolicy.org','americanpressinstitute.org','americanprinciplesproject.org','americanprogress.org','americanpublicmedia.org','americanpurpose.com','americansarepissed.com','americanscientist.org','americansforprosperity.org','americansfortruth.com','americanthinker.com','americantruthtoday.com','americarisingpac.org','americasfreedomfighters.com','americasfrontlinedoctors.com','americasnewssource.com','americasquarterly.org','americasvoice.news','americatalks.com','amestoday.com','amgreatness.com','amimagazine.org','amityunderground.com','ammoland.com','amnesty.org','amny.com','aol.com','amomama.com','amren.com','amsterdamnews.com','amtvmedia.com','analyzingamerica.org','ancient-code.com','ancient-origins.net','andersonreporter.com','anewspost.com','angrypatriotmovement.com','angrywhitemen.org','angusreid.org','anh-usa.org','aninews.in','annistonstar.com','anonews.co','anonhq.com','ansa.it','answersingenesis.org','antelopevalleytoday.com','anthropocenemagazine.org','antifascistnews.net','antiwar.com','anx.media','anyavien.com','apa.org','aphapublications.org','apmreports.org','apnews.com','apost.com','app.com','apple.com','appledaily.com','aps.org','apsa.org','aptnnews.ca','arabnews.com','arcamax.com','arcdigital.media','archaeology-world.com','archaeology.org','areomagazine.com','argusleader.com','arirang.com','arizonadailyindependent.com','arkansasonline.com','arktimes.com','armscontrol.org','climatesciencewatch.org','armstrongeconomics.com','armytimes.com','arstechnica.com','arte.tv','asahi.com','asia-pacificresearch.com','asiancorrespondent.com','asianews.it','asiasentinel.com','asiatimes.com','askingangels.com','aspeniaonline.it','aspeninstitute.org','assassinationscience.com','astronomy.com','atavist.com','athensreporter.com','atlanta.cbslocal.com','atlantablackstar.com','atlanticcouncil.org','atlanticmedia.com','atlasobscura.com','atlbanana.com','atlstandard.com','atr.org','attackthesystem.com','attn.com','au.org','auburnpub.com','auburntimes.com','augustachronicle.com','austinchronicle.com','austindailyherald.com','australiannationalreview.com','autisminvestigated.com','autismspeaks.org','autisticadvocacy.org','autostraddle.com','avclub.com','avoiceformen.com','awarenessact.com','awm.com','axiomnewsnetwork.com','axios.com','aynrand.org','azcapitoltimes.com','azcentral.com','azdailysun.com','azfamily.com','babylonbee.com','backchannel.com','backroombuzz.com','badgerinstitute.org','bakersfieldnow.com','baldwintimes.com','balkaninsight.com','ballotpedia.org','baltimore.cbslocal.com','baltimoresun.com','bangkokpost.com','bangordailynews.com','banned.video','baptistnews.com','barenakedislam.com','barrietoday.com','barrons.com','basnews.com','batimes.com.ar','battlecreekenquirer.com','baxterbulletin.com','baynature.org','bb4sp.com','bbarta24.net','bbc.co.uk','bbc.com','bdnews24.com','beachbroadcastnews.com','beaconjournal.com','bearingarms.com','beckernews.com','beforeitsnews.com','beholdisrael.org','beinglibertarian.com','belfercenter.org','beliefnet.com','bellingcat.com','bellinghamherald.com','bentontimes.com','benzinga.com','berkeleyside.com','berkshireeagle.com','berliner-zeitung.de','berlingske.dk','bestdailynews.info','bestlifeonline.com','bestnewshere.com','betootaadvocate.com','bettergov.org','bgr.com','bigcountryhomepage.com','illuminatiwatcher.com','biggovernment.news','bigislandtimes.com','bigleaguepolitics.com','bignewsnetwork.com','bigthink.com','bild.de','billingsgazette.com','billionbibles.org','billmoyers.com','bing.com','bio.org','biodefense.com','biologos.org','biomedcentral.com','biospace.com','bipartisanpolicy.org','bipartisanreport.com','birminghammail.co.uk','bismarcktribune.com','bitchmedia.org','bitchute.com','bizpacreview.com','bjreview.com','blabber.buzz','blackagendareport.com','blackamericaweb.com','blackeyepolitics.com','blackgenocide.org','blacklistednews.com','blacklivesmatter.com','blackmainstreet.net','blacknews.com','blackpigeonspeaks.com','blastingnews.com','bleacherreport.com','bleepingcomputer.com','blingnews.com','bloodandsoil.org','bloomberg.com','bloomberg.com/citylab','bloomingtonleader.com','bluedotdaily.com','bluenewsnetwork.com','bluestatedaily.com','bluestemprairie.com','bluntforcetruth.com','bmj.com','bnd.com','bnonews.com','bnr.nl','boingboing.net','boisecitywire.com','boldprogressives.org','bongino.com','bonsens.info','boomlive.in','borderreport.com','bossip.com','boston.cbslocal.com','boston.com','bostonglobe.com','bostonherald.com','bostonreview.net','boundingintocomics.com','bozemandailychronicle.com','bradford-delong.com','bramptonguardian.com','brandnewtube.com','breaking911.com','breakingburgh.com','breakingchristiannews.com','breakingdefense.com','breakingfirst.com','breakingnews247.net','breakingnewshouse.com','nowthisnews.com','breakingwide.com','breitbart.com','brennancenter.org','brevardsun.com','brexitcentral.com','bridgemi.com','bridgeporttimes.com','brighteon.com','brightside.me','bringmethenews.com','britainfirst.org','britannica.com','broadenimpact.com','brookings.edu','brownsvilleherald.com','bt.dk','budapestbeacon.com','buffalochronicle.com','buffalonews.com','bugout.news','bullshido.net','bullshitnews.org','burnettcountysentinel.com','burrardstreetjournal.com','business-standard.com','business2community.com','businessinsider.com','businesslive.co.za','bust.com','bustatroll.org','bustle.com','buzzfeed.com','buzzfeednews.com','buzzsawpolitics.com','bylinetimes.com','c-span.org','c2cjournal.ca','c4ads.org','c4ss.org','ca-political.com','cagw.org','cair.com','caixinglobal.com','caldronpool.com','calgaryherald.com','calgarysun.com','californiaglobe.com','caller.com','calltoactivism.com','usahitman.com','calwatchdog.com','cambridge.org','campaignforliberty.org','campaignlifecoalition.com','campusinsanity.com','campusreform.org','canadafactcheck.ca','canadafreepress.com','canadalandshow.com','canadiandimension.com','canadians.org','cancer.news','cancer.org','cap-news.com','capecodtimes.com','capitalandmain.com','capitalgazette.com','capitalismmagazine.com','capitalresearch.org','capitolfax.com','capoliticalreview.com','carbonbrief.org','carbondalereporter.com','care2.com','caribbeanlifenews.com','carm.org','carnegieendowment.org','carolinapublicpress.org','castanet.net','catchnews.com','catholic.org','cato.org','cbc.ca','cbn.com','cbo.gov','cbpp.org','cbs12.com','cbs17.com','cbs42.com','cbs4indy.com','cbsnews.com','cc.org','ccn.com','cctv.com','cdareporter.com','cdc.gov','cdt.org','ceasefiremagazine.co.uk','ced.org','cedarrapidstoday.com','cei.org','censor.net','centennialstatenews.com','centerforinquiry.org','centerforsecuritypolicy.org','centralbrowardnews.com','centralcoloradonews.com','centralgeorgianews.com','centralidahotimes.com','centraliowatimes.com','centraloctimes.com','cepr.net','cernovich.com','cfact.org','cfr.org','cftni.org','cgdev.org','cgtn.com','chalkbeat.org','chambanasun.com','change.org','channel4.com','channelnewsasia.com','charismanews.com','columbusfreepress.com','charitynavigator.org','charlotteobserver.com','chaser.com.au','checkpointasia.net','checkyourfact.com','cheddar.com','chicago.cbslocal.com','chicagocitywire.com','chicagodaily.pro','chicagoreader.com','chicagoreporter.com','chicagotribune.com','chicksonright.com','chicotimes.com','childrenshealthdefense.org','china.org.cn','chinaafricaproject.com','chinadaily.com.cn','chinadigitaltimes.net','chinookobserver.com','chlorellafactor.com','chosun.com','christianaction.org','christianheadlines.com','christianitytoday.com','christiannewsalerts.com','christianpost.com','christianscience.com','christiansfortruth.com','christiantoday.com','chronicle.com','chronicle.su','chroniclesmagazine.org','churchmilitant.com','cincinnati.com','citizen-times.com','citizen.co.za','citizen.org','citizencritics.org','citizenfreepress.com','citizensforethics.org','citizensjournal.us','citizensunited.org','citizentruth.org','city-journal.org','cityandstateny.com','citynews1130.com','citypages.com','civilbeat.org','cjonline.com','cjr.org','claremont.org','clarionledger.com','clarionproject.org','clashdaily.com','claycotimes.com','cleantechnica.com','cleveland.com','clickhole.com','clickondetroit.com','climate.news','climateactiontracker.org','climatecentral.org','climatechangedispatch.com','climatedepot.com','climatefeedback.org','climaterealityproject.org','climatescienceinternational.org','climatism.blog','cloverchronicle.com','cnas.org','cnbc.com','cnet.com','cnn.com','cnsnews.com','cnycentral.com','coachellatoday.com','coastalganews.com','coasttocoastam.com','cobbreporter.com','cochrane.org','coconinonews.com','codepink.org','colddeadhands.us','collapse.news','collective-evolution.com','colombiareports.com','coloradoan.com','coloradosun.com','colorlines.com','columbia.edu','columbiadailyherald.com','columbian.com','columbusstandard.com','comicsands.com','commdiginews.com','commentarymagazine.com','commercialappeal.com','commoncause.org','commondreams.org','commonwealmagazine.org','commonwealthfund.org','communemag.com','communityimpact.com','complex.com','concernedwomen.org','concordmonitor.com','confederacyofdrones.com','congress.gov','consciouslifenews.com','conservapedia.com','conservative.org','conservativeammo.com','conservativebase.com','conservativebeaver.com','conservativebuzz.com','conservativebyte.com','wtop.com','conservativedailynews.com','conservativedailypost.com','conservativefiringline.com','conservativefreepress.com','conservativehome.com','conservativehq.org','conservativeinstitute.org','conservativematrix.com','conservativeopinion.com','conservativepapers.com','conservativeplaylist.com','conservativepost.com','conservativereview.com','conservativetoday.com','conservativetoday.org','conservativewoman.co.uk','consortiumnews.com','conspiracydailyupdate.com','constative.com','constitutioncenter.org','constitutionproject.org','constitutionstatenews.com','consumerist.com','consumerlab.com','consumerreports.org','consumerwellness.org','cookpolitical.com','copblock.org','corbettreport.com','cornell.edu','corona-transition.org','coronavirus.gov','corriere.it','cosmicintelligenceagency.com','cosmopolitan.com','cosmosmagazine.com','councilforthenationalinterest.org','countable.us','countercurrents.org','counterpunch.org','counterthink.com','countryliving.com','courant.com','courier-journal.com','courier-tribune.com','couriermail.com.au','courthousenews.com','covid19criticalcare.com','covidtracking.com','cowgernation.com','cp24.com','cpac.ca','cpi.org','cpj.org','cracked.com','crainsdetroit.com','creation.com','creationwiki.org','crfb.org','crikey.com.au','crimeola.com','crimeresearch.org','crimethinc.com','dailyboulder.com','crisisgroup.org','crisismagazine.com','crooked.com','crooksandliars.com','crosscut.com','csglobe.com','csis.org','csmonitor.com','ctj.org','ctmirror.org','ctpost.com','ctvnews.ca','cumberlink.com','curiousmindmagazine.com','currentaffairs.org','curvemag.com','cw33.com','cw39.com','daily-chronicle.com','daily-journal.com','daily49er.com','dailybulletin.com','dailybuzzlive.com','dailycaller.com','dailycamera.com','dailyclimate.org','dailydiscord.com','dailydot.com','dailygazette.com','dailygrail.com','dailyheadlines.net','dailyhealthpost.com','dailyherald.com','dailyhive.com','dailyjournalonline.com','dailykos.com','dailymail.co.uk','dailymaverick.co.za','dailynews.com','dailynewsbin.com','dailynorthwestern.com','dailyo.in','dailyoccupation.com','dailypoliticalnewswire.com','dailyposter.com','dailypress.com','dailyprogress.com','dailyreckoning.com','dailyrecord.co.uk','dailyrecord.com','dailysignal.com','dailysnark.com','dailysoundandfury.com','dailysquib.co.uk','dailystar.co.uk','dailystormer.name','dailysurge.com','dailytarheel.com','dailytelegraph.com.au','dailytorch.com','dailywire.com','dailyworldupdate.us','dallasnews.com','dallasvoice.com','daltondailycitizen.com','darientimes.com','darkjournalist.com','davidharrisjr.com','davidicke.com','davidwolfe.com','dawn.com','discovery.org','daytondailynews.com','dc-chronicle.com','dcalert.com','dccircuitbreaker.org','dcclothesline.com','dcdirtylaundry.com','dcgazette.com','dcist.com','dcreport.org','dcstatesman.com','deadline.com','deadspin.com','deadstate.org','debka.com','debunkingdenialism.com','decaturtimes.com','deccanchronicle.com','deccanherald.com','deepleftfield.info','deepsouthvoice.com','defconnews.com','defconwarningsystem.com','popsci.com','defenddemocracy.org','defendingtherepublic.org','defensenews.com','defenseone.com','defiantamerica.com','dekalbganews.com','dekalbtimes.com','delawareonline.com','delo.si','delrionewsherald.com','democracy21.org','democracychronicles.org','democracyguardian.com','democracyjournal.org','democracynow.org','democratandchronicle.com','democratherald.com','democratichub.com','democraticunderground.com','democrats.org','demos.org','dentonrc.com','denver.cbslocal.com','denvercitywire.com','denvergazette.com','denverpost.com','deplorablekel.com','derfmagazine.com','derstandard.at','deseret.com','desertsun.com','deshabhimani.com','desmogblog.com','desmoinesregister.com','desmoinessun.com','detik.com','detroit.cbslocal.com','detroitnews.com','deutschland.de','diepresse.com','differencebetween.net','digg.com','digifection.com','digitaljournal.com','diply.com','disabilityscoop.com','disclose.tv','discovermagazine.com','discoverthenetworks.org','disobedientmedia.com','dispatch.com','disrn.com','dissentmagazine.org','distributednews.com','diversityinc.com','djhjmedia.com','dmagazine.com','dmlnews.com','dn.se','dnj.com','dnyuz.com','doctoroz.com','doctorswithoutborders.org','dominionpost.com','donaldjtrump.com','downsizinggovernment.org','dpa.com','draxe.com','drudge.com','drudgereport.com','drugs.com','dubuquetimes.com','duffelblog.com','duhprogressive.com','duluthnewstribune.com','dupagepolicyjournal.com','durangoherald.com','dutchdailynews.com','dutchreview.com','duvaltimes.com','dw.com','dworkinreport.com','eagleactionreport.com','eaglerising.com','eagletribune.com','earthfirstjournal.org','earthjustice.org','earthpulse.com','earthsky.org','eastalamedanews.com','eastarapahoenews.com','eastarizonanews.com','eastbaytimes.com','eastcentralreporter.com','eastcontracostanews.com','easthillsboroughnews.com','eastidahonews.com','eastidahotimes.com','eastindynews.com','eastlittlerocktimes.com','eastpanhandlenews.com','eastsandiegonews.com','eastsbvtimes.com','eastsfvtoday.com','eastsierranews.com','eastventuranews.com','eastvolusianews.com','ebar.com','ecalabamanews.com','ecfr.eu','echocheck.org','ecindiananews.com','eciowanews.com','ecology.news','econofact.org','economicpolicyjournal.com','economicshelp.org','economictimes.com','economictimes.indiatimes.com','economist.com','ecowatch.com','ecuavisa.com','edge.org','edmontonexaminer.com','edmontonjournal.com','thebureauinvestigates.com','edmontonsun.com','edp24.co.uk','educate-yourself.org','educateinspirechange.org','eff.org','egbertowillies.com','egyptianstreets.com','egypttoday.com','ejinsight.com','ekirikas.com','eldiario.es','eldiariony.com','electoral-vote.com','electronicintifada.net','electroverse.net','elitedaily.com','elizabethjohnston.org','elkharttruth.com','elkodaily.com','elle.com','elmundo.es','elnuevodia.com','elpais.com','elpasotimes.com','eluxemagazine.com','emeraldcoasttimes.com','emerging-europe.com','emirates247.com','empirenews.net','empiresports.co','emptywheel.net','en-volve.com','endthefed.org','endtimeheadlines.org','energy.gov','energycitizens.org','engadget.com','entrepreneur.com','epi.org','epnewsleader.com','eppc.org','erlc.com','err.ee','escapeallthesethings.com','espn.com','esquire.com','eugenics.news','euobserver.com','euractiv.com','eurasiagroup.net','eurasiareview.com','eurekalert.org','euronews.com','europe-israel.org','eutimes.net','eveningharold.com','everycrsreport.com','everydayfeminism.com','everydayhealth.com','everytownresearch.org','evil.news','evolutionnews.org','evonomics.com','ew.com','ewg.org','examine.com','explainlife.com','exposinggovernment.com','exposingtruth.com','theneedling.com','express.co.uk','expressen.se','expressnews.com','extranewsfeed.com','fabiosa.com','factcheck.org','factcheckingturkey.com','factmyth.com','factsandlogic.org','factswanted.com','factwire.org','fair.org','fairobserver.com','fairus.org','fairvote.org','faithfamilyamerica.com','faithit.com','faithpanda.com','faithwire.com','fakehatecrimes.org','familysurvivalheadlines.com','farleftwatch.com','farsnews.com','fas.org','fashthenation.com','fastcompany.com','fayettevillestandard.com','fayobserver.com','faz.net','fbherald.com','fbnewscycle.com','federalistpress.com','federalnewsnetwork.com','federaltimes.com','fedsoc.org','fee.org','fellowshipoftheminds.com','femalista.com','feministcurrent.com','feministfrequency.com','feministing.com','ff.org','ff911truthandunity.org','fff.org','ffrf.org','fibrohealthnews.com','fifthestate.org','fightforthefuture.org','filmingcops.com','financialexpress.com','financialpost.com','finnishnews.fi','firearmsnews.com','firstcoastnews.com','firstdraftnews.org','firstinfreedomdaily.com','firstpost.com','firststatetimes.com','firstthings.com','fitchratings.com','fitsnews.com','fivethirtyeight.com','fl24.net','flagandcross.com','flake.news','floridapolitics.com','fmobserver.com','focusonthefamily.com','focustaiwan.tw','followthemoney.org','food.news','foodandwaterwatch.org','foodbabe.com','foodmatters.com','foodnavigator.com','fool.com','forbes.com','foreignaffairs.com','foreignpolicy.com','foreignpolicyi.org','foreignpolicyjournal.com','foreignpolicynews.org','foreverconscious.com','fortherightnews.com','fortnightlyreview.co.uk','fortsmithtimes.com','fortune.com','forward.com','fosters.com','fourstateshomepage.com','fox11online.com','fox23maine.com','fox29.com','fox2now.com','fox35orlando.com','fox40.com','fox46.com','fox56.com','fox59.com','fox5sandiego.com','fox8.com','foxbusiness.com','foxnews.com','foxreno.com','foxrochester.com','foxsanantonio.com','fpif.org','fpri.org','fr24news.com','france24.com','francetvinfo.fr','franklinnews.org','frankmag.ca','frankspeech.com','fraserinstitute.org','frc.org','freakonomics.com','free-speechfront.info','freebeacon.com','freedom.news','freedomadvocates.org','freedomainradio.com','freedomalliance.org','freedomandprosperity.org','freedomcrossroads.com','freedomfirstnetwork.com','freedomhouse.org','freedomnews.org.uk','freedomnewsreport.com','freedomproject.com','freedomworks.org','freep.com','freepress.org','freerepublic.com','freespeech.org','freetelegraph.com','freewestmedia.com','fresnobee.com','fresnoleader.com','friatider.se','friendsofscience.org','frnewsreport.com','fromthetrenchesworldreport.com','frontiersin.org','frontpagelive.com','frontpagemag.com','ft.com','ftwaynetimes.com','fullfact.org','fusion.tv','futurism.com','fwweekly.com','g-a-i.org','gadsdentoday.com','gaia.com','gainesville.com','galesburgreporter.com','gallup.com','gao.gov','gatestoneinstitute.org','gaystarnews.com','gazette.com','gazettenet.com','gbnews.uk','geek.com','gellerreport.com','gemstatewire.com','genengnews.com','genesiustimes.com','geneticliteracyproject.org','genzconservative.com','geo.tv','geoengineering.news','geoengineeringwatch.org','geologyin.com','geopol.institute','geopolitics.co','geopoliticsalert.com','georgiamountainnews.com','getholistichealth.com','getreligion.org','gettr.com','ghionjournal.com','ghost.report','girlsjustwannahaveguns.com','gishgallop.com','gizmodo.com','glaad.org','glamour.com','glitch.news','globalcitizen.org','globalhealingcenter.com','globalintegrity.org','globalnews.ca','globalrealnews.com','globalresearch.ca','globalriskinsights.com','globalskywatch.com','globalslaveryindex.org','globaltimes.cn','globalvoices.org','globegazette.com','globemagazine.com','gmanetwork.com','gmfus.org','gmowatch.com','gmwatch.org','gnews.org','go.com','godandscience.org','godfatherpolitics.com','godlikeproductions.com','goerie.com','goldcountrytoday.com','goldenstatetoday.com','gomerblog.com','good.is','goodgopher.com','goodmenproject.com','goodnewsnetwork.org','goop.com','gop.com','gop.gov','gopdailybrief.com','gopusa.com','gothamist.com','gotquestions.org','gov.uk','governing.com','govexec.com','govtrack.us','govtslaves.com','gp.se','gq.com','grabien.com','grainoftruth.ca','grandcanyontimes.com','grandjunctiontimes.com','granma.cu','gravelinstitute.org','greanvillepost.com','greatamericandaily.com','greatamericanpolitics.com','haaretz.com','greatamericanrepublic.com','greatfallstribune.com','greatreject.org','greeleytribune.com','greenbaypressgazette.com','greenleft.org.au','greenmedinfo.com','greenpeace.org','greensboro.com','greentechmedia.com','greenvilleonline.com','grist.org','gritpost.com','ground.news','group30.org','grundyreporter.com','grunge.com','guampdn.com','guardianlv.com','gucmakale.com','gulagbound.com','gulfnews.com','guns.com','gunviolencearchive.org','guttmacher.org','haarp.net','halturnerradioshow.com','hanfordsentinel.com','hangthebankers.com','hannity.com','harddawn.com','harpers.org','hartfordreporter.com','harvard.edu','harvardpolitics.com','hastingstribune.com','hawarnews.org','hawkeyereporter.com','hbr.org','hcn.org','headtopics.com','healingfoodreference.com','healingoracle.ch','healio.com','health.com','health.news','healthaffairs.org','healthcarefinancenews.com','healthdata.org','healthfeedback.org','healthimpactnews.com','healthline.com','healthnutnews.com','healthranger.com','healthrangerreport.com','healthy-holistic-living.com','healthyandnaturalworld.com','healthyfoodhouse.com','healthyway.com','heartland.org','heavy.com','helenair.com','helsinkitimes.fi','helvidius.org','herald-dispatch.com','herald-review.com','heraldnet.com','heraldnews.com','heraldonline.com','heraldscotland.com','heraldsun.com','heraldsun.com.au','heraldtribune.com','herb.co','herbreference.com','hereistheevidence.com','heritage.org','hermancain.com','hernandoreporter.com','heterodoxacademy.org','hhs.gov','hidesertstar.com','higherperspectives.com','highline.huffingtonpost.com','hillreporter.com','hillsdale.edu','hindustantimes.com','historynewsnetwork.org','hjnews.com','hln.be','hoggwatch.com','hollywoodreporter.com','homelandsecuritynewswire.com','honestreporting.com','honolulureporter.com','hoodsite.com','hoosierstatetoday.com','hoover.org','hopkinsmedicine.org','hotair.com','hotnews.ro','hotspringstimes.com','housatonicvalleynews.com','house.gov','houstonchronicle.com','howstuffworks.com','howtogeek.com','hpenews.com','hrc.org','hrw.org','hs.fi','hsionline.com','hudson.org','huffingtonpost.com','huffpost.com','humanevents.com','humanium.org','humanprogress.org','humansarefree.com','huntsvilleleader.com','hurriyet.com.tr','hurriyetdailynews.com','huzlers.com','i24news.tv','ibleedredwhiteblue.com','ibtimes.com','iceagenow.info','icenews.is','icij.org','icitizen.com','icr.org','icrw.org','idahopress.com','idahostatejournal.com','idahostatesman.com','iea.org','ieee.org','iefimerida.gr','ifamericaknew.org','iflscience.com','ifstudies.org','iharare.com','ihatethemedia.com','ihealthtube.com','iheartintelligence.com','ihr.org','ihypocrite.net','ijr.com','ilgiornale.it','illegalaliencrimereport.com','illicitinfo.com','illinoispolicy.org','illinoisvalleytimes.com','ilovemyfreedom.org','imao.us','imediaethics.org','imeu.org','imowired.com','imperialcanews.com','inc.com','independent.co.uk','independent.com','independent.ie','independent.org','independentaustralia.net','independentmail.com','independentsciencenews.org','independentsentinel.com','indexmundi.com','india.com','indianexpress.com','indiatimes.com','indiatoday.in','indiatvnews.com','indypendent.org','indystandard.com','indystar.com','inequalitymedia.org','inews.co.uk','infiniteunknown.net','influencewatch.org','infobae.com','infobattle.org','infogalactic.com','informationclearinghouse.info','informationliberation.com','inforos.ru','inforum.com','infoscum.com','infowars.com','ingredients.news','inhomelandsecurity.com','innerstrength.zone','inquirer.com','inquirer.net','inquisitr.com','insideclimatenews.org','insideedition.com','insidehighered.com','insidephilanthropy.com','insider.com','insidescience.org','insidesources.com','intellectualtakeout.org','intellihub.com','interioralaskanews.com','internationalpolicy.org','internationalviewpoint.org','interpretermag.com','inthesetimes.com','intrepidreport.com','inverse.com','investigaterussia.org','investing.com','investmentwatchblog.com','investopedia.com','investors.com','iop.org','iowacapitaldispatch.com','iowacitytoday.com','iowaclimate.org','iowastartingline.com','ipatriot.com','ipcc.ch','ipi.media','ipolitics.ca','ips-dc.org','ire.org','irena.org','irishexaminer.com','irishmirror.ie','irishtimes.com','irrawaddy.com','ispp.org','israel21c.org','israelhayom.com','israelislamandendtimes.com','israelnationalnews.com','issues.org','issuesinsights.com','itep.org','itsgoingdown.org','itv.com','ivn.us','iwf.org','iwpr.org','jacksonfreepress.com','jacksonsun.com','jacksonville.com','jacobinmag.com','jalopnik.com','jamestown.org','janes.com','japantimes.co.jp','japantoday.com','jeffersonreporter.com','jesus-is-savior.com','jesusdaily.com','jewishbreakingnews.com','jewishjournal.com','jewishpolicycenter.org','jewishpress.com','jewishworldreview.com','jezebel.com','medpagetoday.com','jihadica.com','jns.org','joebiden.com','joebiden.news','joerogan.com','join1440.com','jointcenter.org','jonesborotimes.com','jordantimes.com','journal-news.net','journaldemontreal.com','journalgazette.net','journalnow.com','journalstandard.com','journalstar.com','jpost.com','jsonline.com','jstor.org','jta.org','juancole.com','judicialnetwork.com','judicialwatch.org','judithcurry.com','junkscience.com','justfacts.com','justfactsdaily.com','justicedenied.org','justsecurity.org','justthefacts.org','justthenews.com','kait8.com','kanecountyreporter.com','kankakeetimes.com','kansas.com','kansascity.com','kansaspolicy.org','kare11.com','katu.com','kauaisun.com','kbtx.com','kcci.com','kcna.kp','kcra.com','kcrg.com','kctv5.com','kdvr.com','kendallcountytimes.com','medscape.com','kenoshanews.com','kentcountytoday.com','kentuckianatimes.com','kentucky.com','kerncountytimes.com','ketv.com','keywestreporter.com','kff.org','kfor.com','kgns.tv','kingscountytimes.com','kiplinger.com','kiro7.com','kitv.com','kktv.com','klewtv.com','kmov.com','kmph.com','knewz.com','knightfoundation.org','knightstemplarorder.com','knopnews2.com','knowherenews.com','knowyourmeme.com','knoxnews.com','koamnewsnow.com','koco.com','koin.com','kokomostandard.com','kold.com','kolotv.com','komonews.com','koreaherald.com','koreatimes.co.kr','kotaku.com','kpic.com','kqed.org','kron4.com','ksl.com','ksnblocal4.com','kstp.com','ktla.com','ktul.com','ktva.com','ktvu.com','kuow.org','kurdistan24.net','kutv.com','kxii.com','ky3.com','kyivpost.com','kyma.com','laconiadailysun.com','ladbible.com','ladepeche.fr','lafayettetimes.com','laharbornews.com','lakecountygazette.com','laketahoesun.com','lalibre.be','lamag.com','lancastercourier.com','lancasteronline.com','lansingstatejournal.com','lapresse.ca','larimernews.com','larknews.com','larouchepac.com','lastampa.it','lastfrontiernews.com','lastresistance.com','lasvegassun.com','latest.com','latimes.com','latintimes.com','naturallysavvy.com','latitudes.org','lavendermagazine.com','law.com','law360.com','laweekly.com','lawenforcementtoday.com','lawfareblog.com','laxleader.com','lbc.co.uk','lcsun-news.com','ldnews.com','leaderpost.com','leadertelegram.com','leadstories.com','learnliberty.org','learntherisk.org','leavenworthtimes.com','ledevoir.com','lefigaro.fr','leftaction.com','leftcult.com','leftexposed.org','leftfootforward.org','leftjustified.com','leftoverrights.com','leftscoop.com','northcooknews.com','leftvoice.org','legalinsurrection.com','legitgov.org','legorafi.fr','lehighvalleylive.com','leicestermercury.co.uk','lemonde.fr','lesoir.be','lethbridgeherald.com','lewrockwell.com','lexingtoninstitute.org','lfpress.com','lgbtqnation.com','libcom.org','liberalamerica.org','liberationnews.org','libertarianism.org','liberty.news','libertybell.com','libertyhangout.org','libertyheadlines.com','libertynation.com','libertynews.com','libertytalk.fm','libertyvideos.org','libtards.news','lifehacker.com','lifenews.com','lifesitenews.com','lifespa.com','lifezette.com','lincolnproject.us','lindelltv.com','listverse.com','litchfieldhillstoday.com','littlegreenfootballs.com','littlethings.com','liveaction.org','liveleak.com','livescience.com','livestrong.com','livingwhole.org','lmtonline.com','local21news.com','localdvm.com','logically.ai','metro.us','lohud.com','lompocrecord.com','londonwebnews.com','loneconservative.com','longwarjournal.org','losangeles.cbslocal.com','louderwithcrowder.com','lowedeltanews.com','lozierinstitute.org','lubbockonline.com','lucianne.com','lung.org','mackinac.org','macleans.ca','macon.com','maconreporter.com','macontimes.com','madhousemagazine.com','madison.com','madworldnews.com','maga2020.us','magadailyreport.com','magicvalley.com','magicvalleytimes.com','mainebeacon.com','metroeastsun.com','mainichi.jp','mainstreamfakemedia.com','majalla.com','makeuseof.com','malaysia-today.net','malaysiakini.com','manateereview.com','manhattan-institute.org','manilatimes.net','maplight.org','marginalrevolution.com','mariettatimes.com','marinleader.com','marketwatch.com','marxist.com','mashable.com','masslive.com','matsutimes.com','mauinews.com','mauireporter.com','mavenroundtable.io','mayoclinic.org','northdsmnews.com','northegyptnews.com','mb.com.ph','mcall.com','mcclatchydc.com','mchenrytimes.com','mcleancountytimes.com','mcsweeneys.net','meaww.com','mediacircus.com','mediaequalizer.com','mediafactwatch.com','mediafiledc.com','mediaite.com','mediamatters.org','mediapart.fr','mediapost.com','mediaroots.org','medicaldaily.com','medicalkidnap.com','medicalmedium.com','medicalnewstoday.com','medicalxpress.com','medicine.news','medium.com','northfultontoday.com','meduza.io','meforum.org','mehrnews.com','meidastouch.com','memeorandum.com','memepoliceman.com','memri.org','mentaldaily.com','mentalfloss.com','mercatornet.com','mercatus.org','mercedtimes.com','mercola.com','mercopress.com','mercurynews.com','merionwest.com','merryjane.com','metabunk.org','metapedia.org','metricmedianews.com','metro.co.uk','northgwinnettnews.com','metrotimes.com','metrowestdailynews.com','mexiconewsdaily.com','miami.cbslocal.com','miamicourant.com','miamiherald.com','miaminewtimes.com','mic.com','middleamericandemocrat.com','middleeasteye.net','middleeastmonitor.com','migrationpolicy.org','militarist-monitor.org','military.com','militarytimes.com','milliyet.com.tr','mindbodygreen.com','mininggazette.com','minnesota.cbslocal.com','minnpost.com','mintpressnews.com','mirror.co.uk','mises.org','missoulian.com','mixi.media','mlive.com','mnn.com','mobilecourant.com','modbee.com','modernalternativemama.com','modernliberals.com','mohavetoday.com','mondoweiss.net','mongabay.com','monmouth.edu','montereytimes.com','monthlyreview.org','montrealgazette.com','moonbattery.com','moonofalabama.org','morningconsult.com','morningstaronline.co.uk','moronmajority.com','mosaicscience.com','motherjones.com','mothership.sg','moveon.org','mprnews.org','mrc.org','msmagazine.com','msmlies.com','msn.com','msnbc.com','mtdemocrat.com','mtstandard.com','munciereporter.com','muncievoice.com','mycentraljersey.com','mydailyfreedom.com','myfox8.com','mynorthwest.com','myrecordjournal.com','myrightamerica.com','mytwintiers.com','mywebtimes.com','naacp.org','nakedcapitalism.com','napavalleyregister.com','naplesnews.com','naplesstandard.com','nasa.gov','nation.africa','nation.com.pk','nationalacademyofsciences.org','nationalaffairs.com','nationalcenter.org','nationalenquirer.com','nationalfile.com','nationalgeographic.com','nationalinsiders.com','nationalinterest.org','nationalistreview.net','nationaljournal.com','nationalmemo.com','nationalnewswatch.com','nationalobserver.com','nationalpost.com','nationalreview.com','nationalrighttolifenews.org','nationalsecurity.news','nationalvanguard.org','nationmaster.com','nationofchange.org','natmonitor.com','naturalawakeningsmag.com','naturalcures.com','naturalhealth365.com','naturalmedicine.news','naturalnews.com','naturalnewsblogs.com','naturalnewsradio.com','naturalpedia.com','naturalsociety.com','naturalstatenews.com','nature.com','nature.org','naturecoasttimes.com','naugatucktimes.com','nautil.us','navytimes.com','nbc11news.com','nbc12.com','nbc24.com','nbc29.com','nbc4i.com','nbclosangeles.com','nbcnews.com','nbcnewyork.com','nbcwashington.com','nber.org','ncarkansasnews.com','nccivitas.org','ncfloridanews.com','ncgeorgianews.com','ncindiananews.com','ncnewsonline.com','ncpolicywatch.com','ncregister.com','ncsl.org','ndtv.com','nealabamanews.com','neatlantanews.com','nebraska.tv','necalinews.com','necn.com','necoloradonews.com','neconnnews.com','needtoknow.news','nefloridanews.com','neindiananews.com','nejm.org','neonnettle.com','nesacramentonews.com','neuronation.com','neurosciencenews.com','nevalleytimes.com','newamerica.org','newamericannews.com','newatlas.com','newbernsj.com','newbostonpost.com','neweurope.eu','newhumanist.org.uk','newint.org','newleftreview.org','newmatilda.com','newmoderate.com','newnation.org','newpol.org','newrepublic.com','news-gazette.com','news-herald.com','news-journal.com','news-leader.com','news-medical.net','news.cn','news.com.au','news18.com','news24.com','news3lv.com','news9.com','northidahotimes.com','northindynews.com','newsammo.com','newsandguts.com','newsandnews.com','newsandsentinel.com','newsbiscuit.com','newsblaze.com','newsbreak.com','newsbud.com','newsbusters.org','newscentermaine.com','newschannel5.com','newscientist.com','newscorpse.com','newsday.com','newsdeeply.com','newsela.com','newser.com','newsfactsnetwork.com','newsguardtech.com','newsheist.com','newshounds.us','newshourfirst.com','newsinsideout.com','newslookup.com','newsmaven.io','newsmax.com','newsmutiny.com','newsnationnow.com','newsner.com','newsnow.co.uk','newsobserver.com','newsone.com','newsoptimist.ca','newspunch.com','newspushed.com','newsready.com','newsrescue.com','newssloth.com','newstarget.com','newstatesman.com','newsthump.com','newstimes.com','newsview.gr','newswars.com','newsweek.com','newswithviews.com','newsy.com','newyork.cbslocal.com','newyorker.com','newzjunky.com','nextbigfuture.com','nextgov.com','nextobserver.com','nfrw.org','ngo-monitor.org','nhk.or.jp','nhregister.com','niagara-gazette.com','nih.gov','nikkei.com','niskanencenter.org','nj.com','nj1015.com','nknews.org','noaa.gov','nola.com','nolabels.org','noozhawk.com','noqreport.com','nordicmonitor.com','norfolkdailynews.com','north99.org','northalaskanews.com','northbirminghamtimes.com','northbrowardnews.com','northcoastcanews.com','northinlandnews.com','northiowareporter.com','northjeffconews.com','northjersey.com','northkoreatimes.com','northlaketimes.com','northlittlerocktimes.com','northmianews.com','northnewcastlenews.com','northoctimes.com','northpanhandlenews.com','northpimanews.com','northsactoday.com','northsfvtoday.com','northsgvnews.com','nos.nl','notallowedto.com','notrickszone.com','notthebee.com','novinite.com','novinky.cz','now8news.com','nowentertainment.net','nownews.com','nowtheendbegins.com','nowtoronto.com','npcdaily.com','npr.news','npr.org','nra.org','nraila.org','nrdc.org','nrlc.org','nst.com.my','ntd.com','ntknetwork.com','numbersusa.org','nutrientreference.com','nutritionfacts.org','nvic.org','nwalabamanews.com','nwaonline.com','nwarkansasnews.com','nwatlantanews.com','nwconnnews.com','nwfdailynews.com','nwgeorgianews.com','nwillinoisnews.com','nwiowanews.com','nwitimes.com','nwlatimes.com','nwriversidenews.com','nwvalleytimes.com','ny.cbslocal.com','ny1.com','nydailynews.com','nymag.com','nypost.com','nytimes.com','nzherald.co.nz','oaklandcitywire.com','oaoa.com','oathkeepers.org','objectivist.co','observer.com','ocalastandard.com','occupy.com','occupydemocrats.com','occupyindependents.com','occupyyourself.org','oceana.org','ocregister.com','ocweekly.com','off-guardian.org','offgridsurvival.com','oilandwaterdontmix.org','oilprice.com','okcfox.com','okeechobeetimes.com','oklahoman.com','omaha.com','oneangrygamer.net','onegreenplanet.org','oneindia.com','onenewsnow.com','online-updates.net','ontarioproud.ca','opednews.com','opendemocracy.net','opendoorsusa.org','opensecrets.org','opensocietyfoundations.org','openthegovernment.org','openvaers.com','opposingviews.com','opslens.com','order-order.com','oregonlive.com','organicconsumers.org','organicfacts.net','orlandosentinel.com','orlandostandard.com','other98.com','ottawacitizen.com','ottawasun.com','ourfutureinamerica.org','ourhealthguides.com','ourworldindata.org','out.com','outkick.com','outragedpatriot.com','outsidethebeltway.com','overpassesforamerica.com','oye.news','oyez.org','ozy.com','pacificpundit.com','pacificresearch.org','paho.org','palestinechronicle.com','palmbeachdailynews.com','palmbeachpost.com','palmcoasttimes.com','palmerreport.com','pamplinmedia.com','panamacityreporter.com','panampost.com','pandemic.news','pantagraph.com','pantsonfirenews.com','parler.com','pastemagazine.com','patch.com','patheos.com','patriotcrier.com','patrioticmillionaires.org','patrioticviralnews.com','patriotnewsalerts.com','patriotnewsdaily.com','patriotpost.us','patriotreport.com','patriotretort.com','patriots4truth.org','pbs.org','pcmustdie.com','pdmj.org','pe.com','peacedata.net','peachtreetimes.com','peacock-panache.com','peninsuladailynews.com','penncapital-star.com','pennlive.com','pensacolatimes.com','people.com','peoriastandard.com','perezhilton.com','personalinterpretation.com','personalliberty.com','peta.org','pewresearch.org','pfaw.org','pgpf.org','philadelphia.cbslocal.com','phillytrib.com','phillyvoice.com','phl17.com','phnompenhpost.com','phoenixnewtimes.com','phxreporter.com','phys.org','piie.com','pilotonline.com','thetrumpet.com','pinaltoday.com','pinellastimes.com','pinknews.co.uk','pittsburgh.cbslocal.com','pix11.com','pjmedia.com','pjstar.com','placesjournal.org','plos.org','pluralist.com','pmnightlynews.com','pnas.org','pnj.com','pocatellotimes.com','poconorecord.com','pogo.org','policetribune.com','policyed.org','polinews.org','polipace.com','political-discussion.com','politicalcritique.org','politicaldig.com','politicalflare.com','politicalgarbagechute.com','politicalite.com','politicalmayhem.news','politicalstate.org','politicalwire.com','politichicks.com','politico.com','politicsonline.net','politicsthatwork.com','politicususa.com','politifact.com','politifact.news','politifeed.net','politisite.com','politizoom.com','polktimes.com','pollution.news','polygon.com','polygraph.info','pomonavalleynews.com','pop.org','popular.info','populardemocracy.org','popularmechanics.com','popularresistance.org','populationconnection.org','populist.press','populistwire.com','positive.news','post-gazette.com','post-journal.com','postandcourier.com','postbulletin.com','poststar.com','potatriotsunite.com','powderedwigsociety.com','powerlineblog.com','poynter.org','prageru.com','prairiestatewire.com','pravda.com.ua','pravdareport.com','precisionvaccinations.com','prepareforchange.net','presscorp.org','pressdemocrat.com','pressfortruth.ca','pressherald.com','pressprogress.ca','presstv.com','prettycoolsite.com','prevention.com','pri.org','principia-scientific.org','prisonplanet.com','private-eye.co.uk','prnewswire.com','prntly.com','procon.org','progressive.org','progressivefrontier.com','project-syndicate.org','projectcensored.org','projectveritas.com','prophecynewswatch.com','prophecytoday.com','propublica.org','prospect.org','prospectmagazine.co.uk','protocol.com','protothema.gr','protrumpnews.com','providencejournal.com','prri.org','prwatch.org','psmag.com','psychcentral.com','psychologytoday.com','psypost.org','publicintegrity.org','publicinterestlegal.org','publicpolicypolling.com','pulaskitimes.com','pulitzercenter.org','punchbowl.news','punchingbagpost.com','punchng.com','puppetstringnews.com','qanon.pub','qctimes.com','quackwatch.org','quadrant.org.au','quantamagazine.org','recode.net','stiltonsplace.blogspot.com','queerty.com','quillette.com','quincyreporter.com','qz.com','rabble.ca','radio.com','radiotelevisionmarti.com','radiovaticana.va','raleighcw.com','rand.org','randi.org','randpaul.news','rantt.com','rapidcityjournal.com','rappler.com','rapturenewsnetwork.com','rare.us','rasmussenreports.com','rationalground.com','rationalwiki.org','rawconservativeopinions.com','rawstory.com','rd.com','record-eagle.com','recordnet.com','redalertpolitics.com','readersupportednews.org','readfrontier.org','readingthepictures.org','readsludge.com','realcleardefense.com','realclearinvestigations.com','realclearmarkets.com','realclearpolicy.com','realclearpolitics.com','realclearreligion.org','realclearscience.com','realclimate.org','realclimatescience.com','realconservativesunite.com','realfarmacy.com','realjewnews.com','realmofhistory.com','realnews24.com','realnewsrightnow.com','realrawnews.com','reason.com','rebelnews.com','redbluedivide.com','reddingtoday.com','redice.tv','redorbit.com','redoubtnews.com','redpepper.org.uk','redstate.com','redstatewatcher.com','reductress.com','redvoicemedia.com','redwoodempirenews.com','reedcooper.net','refinery29.com','reformedmedia.net','regated.com','registerguard.com','relevantmagazine.com','religionnews.com','remingtonresearchgroup.com','remnantnewspaper.com','renewamerica.com','revcom.us','rodong.rep.kp','renewedright.com','rense.com','rep-am.com','reporterherald.com','reporterslab.org','represent.us','repubblica.it','republicandaily.net','republicanssucks.org','republicreport.org','republicworld.com','rescue.org','researchantisemitism.ca','researchgate.net','resilience.org','resistthemainstream.org','resourcegovernance.org','resourcewatch.org','responsibletechnology.org','retractionwatch.com','returntonow.net','reut.rs','reuters.com','revealnews.org','reviewjournal.com','revolutionradio.org','revolver.news','rewirenewsgroup.com','rfa.org','rfangle.com','rferl.org','rfi.fr','rgj.com','richmond.com','ricochet.com','rightandfree.com','righterway.com','rightwingnews.com','rightwingtribune.com','rightwingwatch.org','riverbender.com','riverbendtimes.com','riverdalepress.com','riverregiontimes.com','roanoke.com','rocanews.com','rocketnews.com','rockfordsun.com','rollcall.com','rollingstone.com','romereporter.com','ronpaulinstitute.org','ronpaullibertyreport.com','rooseveltinstitute.org','rsbnetwork.com','rsf.org','rstreet.org','rt.com','rte.ie','rudaw.net','rumble.com','ruptly.tv','rushlimbaugh.com','russia-insider.com','russialies.com','ruthinstitute.org','sabah.com.tr','sacbee.com','sacramento.cbslocal.com','sacramentostandard.com','sagepub.com','salemnewswire.com','salon.com','samefacts.com','sanctumnews.com','sandiegocitywire.com','sandiegoreader.com','sandiegouniontribune.com','sanevax.org','sanfrancisco.cbslocal.com','sanfransun.com','sangamonsun.com','sanjoaquintimes.com','sanjosestandard.com','sanluisobispo.com','sanmarcosrecord.com','sanmateosun.com','santaclaratoday.com','santacruzstandard.com','santafenewmexican.com','santamariatimes.com','santeplusmag.com','sapiens.org','sarasotareview.com','satirev.org','sciencetimes.com','the-postillon.com','saudigazette.com.sa','savannahnow.com','savannahstandard.com','savejersey.com','savethemales.ca','sayfiereview.com','sbgi.net','sbs.com.au','sbsun.com','scalaskanews.com','scarymommy.com','scconnnews.com','schmedium.org','scicentral.com','science.news','sciencealert.com','sciencebasedmedicine.org','scienceblogs.com','sciencedaily.com','sciencedebate.org','sciencedirect.com','sciencefeedback.co','sciencehistory.org','scienceillustrated.com.au','sciencemag.org','sciencemediacentre.org','sciencenews.org','sciencetrends.com','sciencevibe.com','sciencing.com','scientificamerican.com','scitechdaily.com','scmp.com','scoopnest.com','scoopwhoop.com','scoperatings.com','scotsman.com','scotusblog.com','scroll.in','sctimes.com','sealaskanews.com','searizonanews.com','seatlantanews.com','seattle.cbslocal.com','seattlepi.com','seattletimes.com','secoloradonews.com','secondamendmentdaily.com','secondnexus.com','seconnnews.com','secureamericanow.org','sedenvernews.com','seeker.com','segeorgianews.com','seillinoisnews.com','seindiananews.com','selatimes.com','senate.gov','sentencingproject.org','sentinelksmo.org','seventeen.com','sfbayview.com','sfchronicle.com','sfexaminer.com','sfgate.com','sfvtoday.com','sgtreport.com','sgvstandard.com','shadowproof.com','shafaq.com','shareably.net','shareblue.com','sheepkillers.com','shoalstoday.com','shoebat.com','shondaland.com','shorenewsnetwork.com','shorensteincenter.org','shreveporttimes.com','shtfplan.com','sickchirpse.com','sifted.eu','silive.com','silnews.com','simplepolitics.co.uk','singularityhub.com','siouxcityjournal.com','skepdic.com','skeptic.com','skepticalinquirer.org','skepticalraptor.com','skepticalscience.com','skepticink.com','skeptics.com.au','skeptiko.com','skeptoid.com','sky.com','skyandtelescope.org','skynews.com.au','slate.com','sloreporter.com','sltrib.com','smartnews.com','smh.com.au','smirkingchimp.com','smithsonianmag.com','smobserved.com','snopes.com','snopes.news','sociable.co','socialistworker.org','societyforscience.org','sofrep.com','sohu.com','sojo.net','solanosun.com','sonorannews.com','sonsof1776.com','sootoday.com','sott.net','sourcepolitics.com','sourcewatch.org','southafricatoday.net','southalabamatimes.com','southalamedanews.com','southatlantanews.com','southbayleader.com','southbaysdnews.com','southbendtimes.com','southbendtribune.com','southbirminghamtimes.com','southbrowardnews.com','southcentralreporter.com','southcooknews.com','southendnewsnetwork.net','southernindianatoday.com','southernpatriotnews.com','southfront.org','southfultontoday.com','southgeorgiatimes.com','southgwinnettnews.com','southindynews.com','southjeffconews.com','southlaketoday.com','southmianews.com','southnewcastlenews.com','southoctimes.com','southorlandonews.com','southpalmbeachtoday.com','southpimanews.com','southpinellastimes.com','southsactoday.com','southsfbaynews.com','southsfvtoday.com','southsgvnews.com','space.com','space.news','spectator.co.uk','spectator.org','spectator.us','spectatorworld.com','spectrumlocalnews.com','spectrumnews1.com','spectrumreport.com','speech-point.com','speld.nl','spiegel.de','spiked-online.com','spin.com','splcenter.org','splinternews.com','spokesman.com','sportspickle.com','spotlightpa.org','springstimes.com','sputniknews.com','srnnews.com','stamfordadvocate.com','standard.co.uk','standard.net','standardmedia.co.ke','standpointmag.co.uk','stanislausnews.com','star-telegram.com','staradvertiser.com','stardem.com','staresattheworld.com','starpolitical.com','startribune.com','stateofthenation.co','statepress.com','statesman.com','statesmanjournal.com','statesville.com','statista.com','statnews.com','steadfastandloyal.com','steadfastdaily.com','stepfeed.com','stfnreport.com','stillnessinthestorm.com','stimson.org','stltoday.com','stonecoldtruth.com','stopfake.org','stoppingsocialism.com','stormfront.org','stpete4peace.org','stpetestandard.com','straitstimes.com','strategic-culture.org','strategypage.com','stratfor.com','stream.org','stripes.com','stubhillnews.com','studentnewsdaily.com','stuff.co.nz','stuppid.com','suffolkgazette.com','summit.news','sun-sentinel.com','sundaysportonline.co.uk','sungazette.com','sunherald.com','sunlightfoundation.com','sunshinesentinel.com','suntimes.com','supplementreference.com','supportisraelnow.com','survivalblog.com','sussexreview.com','sustainablepulse.com','swalaskanews.com','swampdrain.com','swarajyamag.com','swarizonanews.com','swarkansastimes.com','swcoloradonews.com','swconnnews.com','swillinoisnews.com','swindiananews.com','swissinfo.ch','swprs.org','swriversidenews.com','swvalleytimes.com','syracuse.com','syriahr.com','syriana-analysis.com','syrianews.cc','tabletmag.com','taipeitimes.com','taiwannews.com.tw','takimag.com','talkingpointsmemo.com','talknetwork.com','tallahassee.com','tallahasseesun.com','tampa.cbslocal.com','tampabay.com','tamparepublic.com','tarbell.org','taskandpurpose.com','tasnimnews.com','tass.com','tatumreport.com','taxfoundation.org','taxjustice.net','taxpayer.com','taxpolicycenter.org','tbdailynews.com','tcf.org','tdn.com','teaparty.org','teapartypatriots.org','techcrunch.com','techdirt.com','technocracy.news','technologyreview.com','techstartups.com','techxplore.com','teddystick.com','teenvogue.com','tehrantimes.com','telegraaf.nl','telegram.com','telegraph.co.uk','telesurenglish.net','tennessean.com','tennesseestar.com','tenthamendmentcenter.com','texasmonthly.com','texasobserver.org','texasstandard.org','texastribune.org','tfp.org','tharawat-magazine.com','thatsnonsense.com','thatsprettygoodscience.com','the-american-interest.com','the-daily.buzz','the-japan-news.com','the-scientist.com','theadvocates.org','theage.com.au','theamericanconservative.com','theamericanmirror.com','theantimedia.com','theatlantic.com','theaustralian.com.au','theautomaticearth.com','thebaffler.com','thebalance.com','thebeardedpatriot.com','thebeaverton.com','thebeltwayreport.com','thebipartisanpress.com','thebl.com','theblacksphere.net','theblaze.com','theblueroute.org','thebostontribune.com','thebreakthrough.org','thebrunswicknews.com','thebulletin.org','thebulwark.com','theburningspear.com','thecanadianpress.com','thecanary.co','thecentersquare.com','thechristianleft.org','thechronicleherald.ca','thecipherbrief.com','thecitizen.org.au','thecitizenpress.com','thecity.nyc','thecjn.ca','thecollegefix.com','thecoloradoherald.com','thecommonsenseshow.com','theconservativebrief.com','theconservativecentral.com','theconservativenut.gop','theconservativetreehouse.com','theconversation.com','thecut.com','thedailybanter.com','thedailybeast.com','thedailybell.com','thedailyconspiracy.com','thedailyliberator.com','thedailymash.co.uk','thedailymire.com','thedailysheeple.com','thedailystar.com','thedailyvox.co.za','theday.com','thedcpatriot.com','thedesertreview.com','thediplomat.com','thedispatch.com','thedodo.com','thedonald.win','theduran.com','theepochtimes.com','theexpose.uk','thefederalist.com','thefederalistpapers.org','thefifthcolumnnews.com','thefirsttv.com','thefiscaltimes.com','theflipside.io','thefloridasqueeze.com','thefreedomtimes.com','thefreepatriot.org','thefreethoughtproject.com','thefrisky.com','thefulcrum.us','thefullertoninformer.com','thegatewaypundit.com','thegazette.com','theglobeandmail.com','thegoodlordabove.com','thegrayzone.com','thegreggjarrett.com','thegrio.com','theguardian.com','theguardiansofdemocracy.com','thehardtimes.net','thehayride.com','thehealthyamerican.org','theheartysoul.com','thehighwire.com','thehill.com','thehilltalk.com','thehindu.com','thehindubusinessline.com','thehornnews.com','thehumanist.com','theihs.org','theimproper.com','theintercept.com','theirishsentinel.com','theitem.com','thejacknews.com','thejakartapost.com','thejeffreylord.com','thejournal.ie','thelancet.com','thelapost.com','thelasource.com','thelaughclub.net','theledger.com','theleoterrell.com','thelibertarianrepublic.com','thelibertybeacon.com','thelibertydaily.com','thelibertyeagle.com','thelibertyloft.com','thelily.com','thelist.com','thelocal.no','thelondoneconomic.com','them.us','themarshallproject.org','themarysue.com','themideastbeast.com','themilitant.com','themillenniumreport.com','themindunleashed.com','theminnesotasun.com','themoderatedmedia.com','themoderatevoice.com','themonitor.com','themonthly.com.au','themoscowtimes.com','thenation.com','thenational.ae','thenationalherald.com','thenationalpatriot.com','thenationalpulse.com','thenevadaindependent.com','thenewamerican.com','thenewatlantis.com','thenewcivilrightsmovement.com','thenewhumanitarian.org','thenewrevere.com','thenews.com.pk','thenews.mx','thenewsliteracyproject.org','thenewstribune.com','thenewtropic.com','thenextweb.com','theobjectivestandard.com','theodysseyonline.com','theohiostar.com','theolympian.com','theonion.com','thepatriotjournal.com','thepatriotnation.net','theskimm.com','thepeoplescube.com','thepoliticalbrief.com','thepoliticalinsider.com','thepolitics.online','thepostemail.com','thepostmillennial.com','theproudliberal.org','thepublicdiscourse.com','thequint.com','therealnews.com','theredelephants.com','theredshtick.com','theregionnews.com','theregister.com','thereisnews.com','thereligionofpeace.com','therepublic.com','therightscoop.com','therightstuff.biz','theringer.com','theroot.com','therundownlive.com','thesaturdaypaper.com.au','thesciencepost.com','thescinewsreporter.com','thescoop.us','theshovel.com.au','thesmokinggun.com','thesorrentino.com','thesouthern.com','thespectator.info','thespoof.com','thestar.com','thestar.com.my','thestarphoenix.com','thestate.com','thestranger.com','thestrategybridge.org','thestreet.com','thesun.co.uk','thesun.ie','thesunmagazine.org','thetab.com','thetandd.com','thetexan.news','thetimes.co.uk','thetimesherald.com','thetowntalk.com','thetrace.org','thetruedefender.com','thetruereporter.com','thetruthaboutcancer.com','thetruthaboutguns.com','thetruthseeker.co.uk','thetruthvoice.net','thetyee.ca','theunionjournal.com','thevaccinereaction.org','thevarsity.ca','theverge.com','thewalrus.ca','thewashingtonpundit.com','thewashingtonsentinel.com','theweek.co.uk','theweek.com','thewest.com.au','thewire.in','thewrap.com','thieme-connect.com','thinkamericana.com','thinkinghumanity.com','thinkprogress.org','thirdway.org','this.org','thisisthezerohour.com','thoughtcatalog.com','thoughtco.com','thoughtcrimeradio.net','thrillist.com','thriveglobal.com','thrivemovement.com','time.com','timeline.com','timescolonist.com','timesfreepress.com','timesheadline.com','timeslive.co.za','timesofindia.indiatimes.com','timesofisrael.com','timesofsandiego.com','timesunion.com','tittletattle365.com','tmz.com','tnonline.com','today.com','todayifoundout.com','toddstarnes.com','toledoblade.com','tomdispatch.com','toofab.com','toptopic.club','torontosun.com','torontotoday.net','tovima.gr','towleroad.com','townhall.com','tplnews.com','tpusa.com','transequality.org','transparency.org','transparentcalifornia.com','transpartisanreview.com','treason.news','treasurecoastsun.com','treasurevalleytimes.com','treehugger.com','trendingpolitics.com','tri-cityherald.com','trialsitenews.com','trib.com','usaisonline.com','triblive.com','tribunecontentagency.com','tribunist.com','tribunnews.com','triggerreset.net','trofire.com','trtworld.com','trueactivist.com','truepundit.com','trueviralnews.com','trump.news','trumpstudents.org','trumptrainnews.com','trunews.com','trust.org','truthandaction.org','truthbetold.news','truthbrary.org','truthdig.com','truthexam.com','truthinmedia.com','truthorfiction.com','truthout.org','uft.org','ukcolumn.org','truthsetter.com','truththeory.com','tucson.com','tucsonstandard.com','tularetimes.com','tulsaworld.com','turnto10.com','turnto23.com','tuscaloosaleader.com','tut.by','tvw.org','twincities.com','twisted.news','twitchy.com','typemediacenter.org','tytnetwork.com','uawire.org','ucsd.edu','ucsusa.org','ukcop26.org','un.org','unclesamsmisguidedchildren.com','uncoverdc.com','undark.org','understandingthethreat.com','understandrealitythroughscience.blogspot.com','unep.org','unicornriot.ninja','unionleader.com','uniteamericafirst.com','unitynewsnetwork.co.uk','universetoday.com','universitybusiness.com','unwatch.org','unz.com','updateamerica.com','upi.com','upperdeltanews.com','upr.org','uproxx.com','upworthy.com','urban.org','us24news.com','usafacts.org','usafortrumponline.com','usanetwork.info','usareally.com','usaspending.gov','usasupreme.com','usatoday.com','usawatchdog.com','usbacklash.org','uschronicle.com','uslibertywire.club','uslibertywire.com','usnationalnews.org','usnews.com','usrightleft.com','ussanews.com','uticaod.com','vaccineimpact.com','vaccines.news','vactruth.com','valleynewslive.com','valuewalk.com','vancouversun.com','vanityfair.com','variety.com','vaxopedia.org','vaxxter.com','vdare.com','wired.com','verafiles.org','verdugosnews.com','vermontindependent.net','verrit.com','verywell.com','verywellfamily.com','veteranstoday.com','vibe.com','vice.com','victoriaadvocate.com','victorvalleytimes.com','vidmax.com','vigilantcitizen.com','villages-news.com','villagevoice.com','vindy.com','viralcocaine.com','viralhatch.com','viralthread.com','viraltitle.com','virginiamercury.com','visiontimes.com','voanews.com','voiceofeurope.com','voiceofsandiego.org','volkskrant.nl','vosizneias.com','votefraud.news','votesmart.org','votevets.org','vox.com','vrevealed.com','vulture.com','wabi.tv','wacotrib.com','wagmtv.com','wakingtimes.com','walesonline.co.uk','wallbuilders.com','wallstreetonparade.com','wamu.org','warnerrobinstoday.com','warontherocks.com','washingtonbabylon.com','washingtonblade.com','washingtondailywire.com','washingtonexaminer.com','washingtonian.com','washingtoninstitute.org','washingtonmonthly.com','washingtonpost.com','washingtonpress.com','washingtonsources.org','washingtonspectator.org','washingtontimes.com','watchdogreport.org','watchers.news','waterfordwhispersnews.com','wattsupwiththat.com','waynedupree.com','wbay.com','wbng.com','wbtv.com','wcalabamanews.com','wcax.com','wcfcourier.com','wcgeorgianews.com','wchstv.com','wcindiananews.com','wctrib.com','wctv.tv','wdbj7.com','wearechange.org','wearethemighty.com','weartv.com','wearyourvoicemag.com','weaselzippers.us','weau.com','webmd.com','wect.com','weeklystandard.com','weforum.org','wehuntedthemammoth.com','welovetrump.com','welt.de','weny.com','westatlantanews.com','westcentralreporter.com','westcontracostanews.com','westcooknews.com','westeldoradonews.com','westernjournal.com','westernmassnews.com','westflnews.com','westhillsboroughnews.com','westindynews.com','westlatimes.com','westmonster.com','westoctimes.com','westonaprice.org','westsbvtimes.com','westsfvtoday.com','westsgvnews.com','westventuranews.com','westvolusianews.com','westword.com','wethepeopledaily.com','wfla.com','wfmynews2.com','wfmz.com','wgme.com','wgntv.com','wgxa.tv','whatdoesitmean.com','whatfinger.com','whatreallyhappened.com','whatregistrater.com','whatstheharm.net','whistleblower.org','whitehouse.gov','whitehouse.news','whitehousewatch.com','whnt.com','who.int','whowhatwhy.org','whsv.com','wibw.com','wifr.com','wikiislam.net','wikileaks.org','wikinews.org','wikipedia.org','wikispooks.com','wikitribune.com','wilderness.org','willcountygazette.com','wilsoncenter.org','wilx.com','winchesterstar.com','windsorstar.com','winecountrytimes.com','wingsoverscotland.com','winnipegfreepress.com','winonadailynews.com','wionews.com','wiregrasstimes.com','wishtv.com','wistv.com','witn.com','wjactv.com','wjhg.com','wjla.com','wkrg.com','wkrn.com','wlos.com','wmo.int','wmur.com','wn.com','wnd.com','wndu.com','wng.org','wnyc.org','wokennews.com','wokesloth.com','womenarehuman.com','wonkette.com','wordpress.com','workers.org','worldaffairsbrief.com','worldcantwait.net','worldcrunch.com','worlddoctorsalliance.com','worldhealth.net','worldnewsdailyreport.com','worldometers.info','worldpoliticsreview.com','worldpopulationreview.com','worldpress.org','worldsocialism.org','worldstarhiphop.com','worldtribune.com','worldtruth.tv','wowt.com','wpgh53.com','wpxi.com','wral.com','wrdw.com','wri.org','wsaz.com','wsbt.com','wset.com','wsj.com','wsvn.com','wsws.org','wtae.com','wtnh.com','wtok.com','wtov9.com','wtvy.com','wusa9.com','wutv29.com','wvgazettemail.com','wvlt.tv','wwmt.com','wwnytv.com','wyomingnewsnow.tv','x22report.com','yaf.org','yahoo.com','yale.edu','yankeeinstitute.org','yavapainews.com','yc.news','ydr.com','yellowhammernews.com','yellowhammertimes.com','yesimright.com','yesmagazine.org','ynetnews.com','yomiuri.co.jp','yorkdispatch.com','yourblackworld.net','yournewsnet.com','youthradio.org','youthrights.org','yubasuttertimes.com','zcomm.org','zdf.de','zdnet.com','zebrafactcheck.com','zeit.de','zenith.news','zerohedge.com','zmescience.com'];


async function add_logo_page(head_url) {
  // fetch all data, create button design, create HTML content
  try{
    var head_url = head_url.replace(/www./g,'').replace(/maps./g,'').replace(/support./g,'').replace(/myactivity./g,'').replace(/myaccount./g,'').replace(/accounts./g,'').replace(/policy./g,'').replace(/policies./g,'').replace('l.facebook','facebook').replace('m.theepochtimes','theepochtimes').replace('bbc.com','bbc.co.uk').replace('eu.usatoday','usatoday').replace('edition.cnn','cnn').replace('https://','').replaceAll('http://','');

    if (head_url.includes('#')){
      var head_url = head_url.substr(0, head_url.indexOf("#"))
    }
    if (head_url.includes('?')){
      var head_url = head_url.substr(0, head_url.indexOf("?"))
    }
    if (head_url.includes('&')){
      var head_url = head_url.substr(0, head_url.indexOf("&"))
    }
    var head_NwsrHref = head_url

    var head_domain = head_url.replace('https://','').replaceAll('http://','').replace(/www./g,'').replace(/maps./g,'').replace(/support./g,'').replace(/myactivity./g,'').replace(/myaccount./g,'').replace(/accounts./g,'').replace(/policy./g,'').replace(/policies./g,'').replace('l.facebook','facebook').replace('m.theepochtimes','theepochtimes').replace('bbc.com','bbc.co.uk').replace('eu.usatoday','usatoday').replace('edition.cnn','cnn').split('/')[0]
    var head_article_source_db = head_domain.replaceAll('rssfeeds.','').replaceAll('www.','').split('/')[0].replaceAll('.','_').replaceAll('-','_')+'_source_db'
    var head_assessment = 'all'
    var head_table = head_article_source_db
    var head_select = '*'
    var head_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDAzMjI5NCwiZXhwIjoxOTQ5NjA4Mjk0fQ.5AJhHMk5HgNvqiBm9w_vCBezpCt8b3JDi-z3seAnhrc'
    var head_api_port = 'https://vbfzhdccxczwbluqmhtv.supabase.co/rest/v1/'+head_table+'?url=eq.'+head_url+'&select='+head_select+'&apikey='+head_api_key
    var head_raw_response = await fetchArticleScoreAsync(head_api_port);
    var head_response = head_raw_response[0]
    var head_overall_score = head_raw_response[2]
    var head_total_score_headline = head_raw_response[2]
    var head_total_score_text = head_raw_response[3]
    var head_source_score_headline = head_raw_response[4]
    var head_source_text = head_raw_response[5]
    var head_author_score_headline = head_raw_response[6]
    var head_author_text = head_raw_response[7]
    var head_ref_score_headline = head_raw_response[8]
    var head_ref_text = head_raw_response[9]
    var head_key_claims_headline = head_raw_response[10]
    if (head_key_claims_headline == 'N/A'){
      head_key_claims_headline = 'Claim matching score: --'
    }
    var head_key_claims_text = head_raw_response[11]
    var head_pir_headline = head_raw_response[12]
    var head_pir_text = head_raw_response[13]
    if (head_overall_score == 'High'){
      var head_color_code = '#167d39'
      var txt_color_code = '#167d39'
    }
    else if (head_overall_score == 'Medium'){
      var head_color_code = '#f9bc07'
      var txt_color_code='#f9bc07'
    }
    else if (head_overall_score == 'Low'){
      var head_color_code = '#990000'
      var txt_color_code= '#990000'
    }
    else {
      var head_color_code = '#666666'
      throw 'Unable to validate article!';
    }

    var head_btn_icon = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg"\
       width="30pt" height="30pt" viewBox="0 0 500 500"\
       preserveAspectRatio="xMidYMid meet">\
      <g transform="translate(0.000000,500) scale(0.100000,-0.100000)"\
      fill="'+head_color_code+'" stroke="none">\
      <path d="M2360 4994 c-182 -13 -319 -35 -503 -84 -84 -22 -219 -65 -252 -80\
      -11 -5 -42 -19 -70 -30 -171 -74 -390 -199 -510 -292 -294 -228 -506 -467\
      -682 -773 -40 -69 -133 -260 -133 -273 0 -4 -6 -19 -14 -33 -18 -35 -70 -195\
      -95 -294 -62 -244 -75 -351 -75 -625 0 -280 12 -378 80 -645 65 -253 204 -558\
      342 -752 88 -124 118 -164 173 -224 35 -40 72 -83 82 -96 33 -42 227 -212 321\
      -282 242 -180 556 -332 838 -405 244 -64 375 -80 638 -80 311 0 451 21 765\
      116 55 17 114 36 130 43 329 145 469 228 690 409 461 379 775 931 873 1536 21\
      133 24 599 4 730 -55 363 -193 726 -385 1015 -114 171 -180 249 -343 411 -195\
      194 -393 334 -649 459 -252 123 -511 201 -781 234 -93 12 -363 21 -444 15z\
      m480 -957 c118 -24 263 -70 351 -113 85 -41 202 -108 221 -127 7 -7 26 -20 41\
      -30 64 -41 221 -192 278 -267 18 -25 36 -47 39 -50 14 -14 140 -215 140 -224\
      0 -3 13 -33 29 -68 44 -94 99 -268 118 -372 15 -79 17 -194 20 -888 l4 -798\
      -746 0 -745 0 0 370 0 370 370 0 370 0 0 383 c0 406 -4 457 -47 572 -92 243\
      -278 423 -511 490 -86 25 -88 25 -504 25 l-418 0 0 -1105 0 -1105 -370 0 -370\
      0 0 1480 0 1481 823 -4 c721 -3 832 -6 907 -20z"/>\
      </g>\
      </svg>'

    var head_html_content = '<header id="NwsrHeader">\
        <div>\
          <a class="NwsrLogo"><img src="https://thenewsroom.ai/wp-content/uploads/2020/11/Newsroom_logo-1.jpg" alt="The Newsroom"></a>\
        </div>\
        </header>\
        <div>\
          <h2 style="font-size:20px; font-family:sans-serif; display:block; margin-block-start:1.6em; margin-inline-start:0px; margin-inline-end:0px; font-weight:bold; color:black;">Overall score: <div style="display:inline; color:'+txt_color_code+';">'+head_total_score_headline+'</h2>\
          <p style="font-size:14px; font-family:sans-serif; display:block; margin-block-start:1em; margin-block-end:1em; margin-inline-start:0px; margin-inline-end:0px; color:black;">'+head_total_score_text+'</p>\
        </div>\
        <p style="padding:2px"></p>\
          <div>\
            <div>\
              <div>\
                <ul class="NwsrFaq-list">\
                  <li>\
                    <div class="NwsrCollapsed NwsrQuestion faq1Nwsr'+head_NwsrHref+'" style="font-size:16px; font-family:sans-serif; display:block; position:relative; font-weight:400; line-height:24px; color:black;">'+head_source_score_headline+'<i class="NwsrIcon-show"></i><i class="NwsrIcon-close"></i></div>\
                    <div id="faq1Nwsr'+head_NwsrHref+'" class="NwsrCollapse">\
                        <p style="font-size:14px; font-family:sans-serif; margin-bottom:0px; padding:0px; display:block; color:black;">'+head_source_text+'</p>\
                    </div>\
                  </li>\
                  <li>\
                    <div class="NwsrCollapsed NwsrQuestion faq2Nwsr'+head_NwsrHref+'" style="font-size:16px; font-family:sans-serif; display:block; position:relative; font-weight:400; line-height:24px; color:black;">'+head_author_score_headline+'<i class="NwsrIcon-show"></i><i class="NwsrIcon-close"></i></div>\
                    <div id="faq2Nwsr'+head_NwsrHref+'" class="NwsrCollapse">\
                        <p style="font-size:14px; font-family:sans-serif; margin-bottom:0px; padding:0px; display:block; color:black;">'+head_author_text+'</p>\
                    </div>\
                  </li>\
                  <li>\
                    <div class="NwsrCollapsed NwsrQuestion faq3Nwsr'+head_NwsrHref+'" style="font-size:16px; font-family:sans-serif; display:block; position:relative; font-weight:400; line-height:24px; color:black;">'+head_ref_score_headline+'<i class="NwsrIcon-show"></i><i class="NwsrIcon-close"></i></div>\
                    <div id="faq3Nwsr'+head_NwsrHref+'" class="NwsrCollapse">\
                        <p style="font-size:14px; font-family:sans-serif; margin-bottom:0px; padding:0px; display:block; color:black;">'+head_ref_text+'</p>\
                    </div>\
                  </li>\
                  <li>\
                    <div class="NwsrCollapsed NwsrQuestion faq4Nwsr'+head_NwsrHref+'" style="font-size:16px; font-family:sans-serif; display:block; position:relative; font-weight:400; line-height:24px; color:black;">'+head_key_claims_headline+'<i class="NwsrIcon-show"></i><i class="NwsrIcon-close"></i></div>\
                    <div id="faq4Nwsr'+head_NwsrHref+'" class="NwsrCollapse">\
                        <p style="font-size:14px; font-family:sans-serif; margin-bottom:0px; padding:0px; display:block; color:black;">'+head_key_claims_text+'</p>\
                    </div>\
                  </li>\
                  <li>\
                    <div class="NwsrCollapsed NwsrQuestion faq5Nwsr'+head_NwsrHref+'" style="font-size:16px; font-family:sans-serif; display:block; position:relative; font-weight:400; line-height:24px; color:black;">'+head_pir_headline+'<i class="NwsrIcon-show"></i><i class="NwsrIcon-close"></i></div>\
                    <div id="faq5Nwsr'+head_NwsrHref+'" class="NwsrCollapse">\
                        <p style="font-size:14px; font-family:sans-serif; margin-bottom:0px; padding:0px; display:block; color:black;">'+head_pir_text+'</p>\
                    </div>\
                  </li>\
                </ul>\
              </div>\
            </div>\
          </div>\
        <p style="font-size:14px; font-family:sans-serif; margin-bottom:10px; margin-top:5px; padding:0px; display:block; font-weight:bold; color:black; padding:2px">Feedback? Ideas on how to improve? Please share them <a href="https://forms.gle/8XhNjt3ESv8oCkjQ9">here</a>!</p>'
  }
  catch(err) {
    var head_NwsrHref = head_url.replace(/www./g,'').replace(/maps./g,'').replace(/support./g,'').replace(/myactivity./g,'').replace(/myaccount./g,'').replace(/accounts./g,'').replace(/policy./g,'').replace(/policies./g,'').replace('l.facebook','facebook').replace('m.theepochtimes','theepochtimes').replace('bbc.com','bbc.co.uk').replace('eu.usatoday','usatoday').replace('edition.cnn','cnn').replace('https://','').replaceAll('http://','');

    if (head_NwsrHref.includes('#')){
      var head_NwsrHref = head_NwsrHref.substr(0, head_url.indexOf("#"))//.substr(0, article_link.indexOf("?")).substr(0, article_link.indexOf("&"))
    }
    if (head_NwsrHref.includes('?')){
      var head_NwsrHref = head_NwsrHref.substr(0, head_NwsrHref.indexOf("?"))//.substr(0, article_link.indexOf("?")).substr(0, article_link.indexOf("&"))
    }
    if (head_NwsrHref.includes('&')){
      var head_NwsrHref = head_NwsrHref.substr(0, head_NwsrHref.indexOf("&"))//.substr(0, article_link.indexOf("?")).substr(0, article_link.indexOf("&"))
    }

    var head_domain = head_url.replace(/www./g,'').replace(/maps./g,'').replace(/support./g,'').replace(/myactivity./g,'').replace(/myaccount./g,'').replace(/accounts./g,'').replace(/policy./g,'').replace(/policies./g,'').replace('l.facebook','facebook').replace('m.theepochtimes','theepochtimes').replace('bbc.com','bbc.co.uk').replace('eu.usatoday','usatoday').replace('edition.cnn','cnn').split('/')[0]
    var head_assessment = 'source'
    var head_table = 'source_scores'
    var head_select = '*'
    var head_api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDAzMjI5NCwiZXhwIjoxOTQ5NjA4Mjk0fQ.5AJhHMk5HgNvqiBm9w_vCBezpCt8b3JDi-z3seAnhrc'
    var head_api_port = 'https://vbfzhdccxczwbluqmhtv.supabase.co/rest/v1/'+head_table+'?domain=eq.'+head_domain+'&select='+head_select+'&apikey='+head_api_key
    var head_source_data = await fetchSourceScoreAsync(head_api_port);
    var head_source_domain = head_source_data[0]
    var head_source_name = head_source_data[1]
    var head_source_bias = head_source_data[2]
    var head_source_score = head_source_data[3]
    var head_source_country = head_source_data[4]
    var head_source_summary = head_source_data[5]
    var head_source_link = head_source_data[6]
    var head_source_history = head_source_data[7]
    var head_source_ownership = head_source_data[8]

    if (head_source_score == 'HIGH' || head_source_score == 'MOSTLY FACTUAL'){
      var head_color_code = '#0066CC'
      var txt_color_code = '#167d39'
    }
    else if (head_source_score == 'MEDIUM' || head_source_score == 'MIXED'){
      var txt_color_code = '#f9bc07'
    }
    else if (head_source_score == 'LOW'){
      var txt_color_code = '#990000'
    }
    else {
      var head_color_code = '#666666'
    }

    var head_btn_icon = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg"\
       width="30pt" height="30pt" viewBox="0 0 500 500"\
       preserveAspectRatio="xMidYMid meet">\
      <g transform="translate(0.000000,500) scale(0.100000,-0.100000)"\
      fill="'+head_color_code+'" stroke="none">\
      <path d="M2360 4994 c-182 -13 -319 -35 -503 -84 -84 -22 -219 -65 -252 -80\
      -11 -5 -42 -19 -70 -30 -171 -74 -390 -199 -510 -292 -294 -228 -506 -467\
      -682 -773 -40 -69 -133 -260 -133 -273 0 -4 -6 -19 -14 -33 -18 -35 -70 -195\
      -95 -294 -62 -244 -75 -351 -75 -625 0 -280 12 -378 80 -645 65 -253 204 -558\
      342 -752 88 -124 118 -164 173 -224 35 -40 72 -83 82 -96 33 -42 227 -212 321\
      -282 242 -180 556 -332 838 -405 244 -64 375 -80 638 -80 311 0 451 21 765\
      116 55 17 114 36 130 43 329 145 469 228 690 409 461 379 775 931 873 1536 21\
      133 24 599 4 730 -55 363 -193 726 -385 1015 -114 171 -180 249 -343 411 -195\
      194 -393 334 -649 459 -252 123 -511 201 -781 234 -93 12 -363 21 -444 15z\
      m480 -957 c118 -24 263 -70 351 -113 85 -41 202 -108 221 -127 7 -7 26 -20 41\
      -30 64 -41 221 -192 278 -267 18 -25 36 -47 39 -50 14 -14 140 -215 140 -224\
      0 -3 13 -33 29 -68 44 -94 99 -268 118 -372 15 -79 17 -194 20 -888 l4 -798\
      -746 0 -745 0 0 370 0 370 370 0 370 0 0 383 c0 406 -4 457 -47 572 -92 243\
      -278 423 -511 490 -86 25 -88 25 -504 25 l-418 0 0 -1105 0 -1105 -370 0 -370\
      0 0 1480 0 1481 823 -4 c721 -3 832 -6 907 -20z"/>\
      </g>\
      </svg>'

    var head_html_content = '<header id="NwsrHeader">\
        <div>\
          <a class="NwsrLogo"><img src="https://thenewsroom.ai/wp-content/uploads/2020/11/Newsroom_logo-1.jpg" alt="The Newsroom"></a>\
        </div>\
        </header>\
        <div>\
          <h2 style="font-size:20px; font-family:sans-serif; display:block; margin-block-start:1.6em; margin-inline-start:0px; margin-inline-end:0px; font-weight:bold; color:black;">Source score: <div style="display:inline; color:'+txt_color_code+';">'+head_source_score+'</h2>\
          <h2 style="font-size:20px; font-family:sans-serif; display:block; margin-block-start:0.4em; margin-block-end:0.83em; margin-inline-start:0px; margin-inline-end:0px; font-weight:bold; color:black;">Political bias: '+head_source_bias+'</h2>\
          <p  style="font-size:14px; font-family:sans-serif; margin-block-start:1.6em; margin-block-end:0.4em; margin-bottom:0px; padding:0px; display:block; color:black;">Country of origin: '+head_source_country+'</h2>\
          <p  style="font-size:14px; font-family:sans-serif; margin-block-start:0.4em; margin-block-end:0.83em; margin-bottom:0px; padding:0px; display:block; color:black;">Summary (<a href="'+head_source_link+'">source</a>): '+head_source_summary+'</p>\
        </div>\
        <p style="padding:2px"></p>\
          <div>\
            <div>\
              <div>\
                <ul class="NwsrFaq-list">\
                  <li>\
                    <div class="NwsrCollapsed NwsrQuestion faq1Nwsr'+head_NwsrHref+'" style="font-size:16px; font-family:sans-serif; display:block; position:relative; font-weight:400; line-height:24px; color:black;">History </div><div style="font-size:16px; font-family:sans-serif; display:inline; color:black;">(<a href="'+head_source_link+'">source</a>)</div><i class="NwsrIcon-show"></i><i class="NwsrIcon-close"></i>\
                    <div id="faq1Nwsr'+head_NwsrHref+'" class="NwsrCollapse">\
                        <p style="font-size:14px; font-family:sans-serif; margin-bottom:0px; padding:0px; display:block; color:black;">'+head_source_history+'</p>\
                    </div>\
                  </li>\
                  <li>\
                    <div class="NwsrCollapsed NwsrQuestion faq2Nwsr'+head_NwsrHref+'" style="font-size:16px; font-family:sans-serif; display:block; position:relative; font-weight:400; line-height:24px; color:black;">Ownership </div><div style="font-size:16px; font-family:sans-serif; display:inline; color:black;">(<a href="'+head_source_link+'">source</a>)</div><i class="NwsrIcon-show"></i><i class="NwsrIcon-close"></i>\
                    <div id="faq2Nwsr'+head_NwsrHref+'" class="NwsrCollapse">\
                        <p style="font-size:14px; font-family:sans-serif; margin-bottom:0px; padding:0px; display:block; color:black;">'+head_source_ownership+'</p>\
                    </div>\
                  </li>\
                </ul>\
              </div>\
            </div>\
          </div>\
        <p style="font-size:14px; font-family:sans-serif; margin-bottom:0px; padding:0px; display:block; color:black; padding:2px">The information above was sourced from assessments made by independent non-profit news rating companies: <a href="'+head_source_link+'">source</a>.</p>\
        <p style="font-size:14px; font-family:sans-serif; margin-bottom:10px; margin-top:5px; padding:0px; display:block; font-weight:bold; color:black; padding:2px">Feedback? Ideas on how to improve? Please share them <a href="https://forms.gle/8XhNjt3ESv8oCkjQ9">here</a>!</p>'
  }

  var body = document.getElementsByTagName('body')[0];

  ////////// Create button elements, and add to page
  //// Create div where we will store the buttons display The Newsroom's logo
  var head_box = document.createElement("div");
  head_box.setAttribute("class", "HeaderNwsrTooltip NwsrTooltip"+head_NwsrHref);

  //// Create button with class name that depends on whether it contains all info or just source_score info
  var head_NwsrParam = "NwsrPopup"+head_NwsrHref;

  var head_btn = document.createElement("div");
  head_btn.setAttribute("class", head_NwsrParam);
  head_btn.setAttribute("style", "z-index: 2147483647!important;");

  //// Create hidden tooltip
  // tooltip span with IDs equal to CLASSes defined above. THIS DOESN'T MAKE SENSE > MAKE NO DISTINCTION BETWEEN SOURCE / ALL
  var head_tooltip = document.createElement("span");
  head_tooltip.setAttribute("class", "NwsrPopuptext")
  head_tooltip.setAttribute("id", head_NwsrParam);
  head_tooltip.setAttribute("style", "overflow:scroll; top:25%; left:10%; border-style:solid; border-color:#35B6BD; border-radius:6px; padding: 10px 10px 10px 10px;")
  body.appendChild(head_tooltip)


  // Add tooltip content
  var head_nwsr_p3 = document.createElement("section");
  head_nwsr_p3.setAttribute("class", "NwsrFaq")
  head_nwsr_p3.setAttribute("id", "NwsrFaq")
  head_nwsr_p3.innerHTML = head_html_content
  head_tooltip.appendChild(head_nwsr_p3)


  //// Add listener that shows tooltip whenever a user hovers over The Newsroom's logo
  head_btn.addEventListener("mouseover", head_myNewFunction);
  function head_myNewFunction()
  {
    try{
      var head_spanToHide = document.querySelector(".NwsrPopuptext.NwsrShow");
      head_spanToHide.classList.toggle("NwsrShow");
    }
    catch(err){
      thiserror = err.message;
    }
    try{
      var head_expFaqSpanToHide = document.querySelector(".NwsrExpand");
      head_expFaqSpanToHide.classList.toggle("NwsrExpand");
    }
    catch(err){
      thiserror = err.message;
    }

    // Toggle corresponding tooltip. Get CLASS from head_btn > find corresponding head_tooltip that has the same ID as that CLASS > toggle that one when a user hovers over the corresponding head_btn
    var head_NwsrThisElementID =String(this.getAttribute("class").split(' ')[0]) // 'this' point to the 'btn', whose class = NwsrParam ("popup"+NwsrHref) OR NwsrParamSource ("popup-source"+NwsrHref) // String(this.getAttribute("class")) // String(this.getAttribute("class").split(' ')[0])+'#'+String(this.getAttribute("class").split(' ')[1])
    var head_popup = document.getElementById(head_NwsrThisElementID);
    head_popup.classList.toggle("NwsrShow");

    // Add Non-GA event tracker
    var Nwsr_URL_tracked = head_spanToHide.getAttribute("id").replace('NwsrPopup','')
    var Nwsr_domain_tracked = Nwsr_URL_tracked.split('/')[0]
    var Nwsr_datetime = new Date()
    NwsrTrackerMessage = 'NwsrTracker__hover__'+Nwsr_URL_tracked+'__'+Nwsr_domain_tracked+'__'+Nwsr_datetime
    chrome.runtime.sendMessage(NwsrTrackerMessage, function(response) {
      // console.log(response)
      thiserror = err.message;
    });

    /// Expand sub-elements within tooltip
    // Get ID above but normalize so all follow the form NwsrPopup (including source only that have ID NwsrPopup-source)
    var head_cleanNwsrThisElementID = head_NwsrThisElementID.replace('NwsrPopup','') //.replace('NwsrPopup-source','')

    // Expand corresponding 1st element when clicked
    var head_faq1_element = document.getElementsByClassName('faq1Nwsr'+head_cleanNwsrThisElementID)[0];
    head_faq1_element.addEventListener("click", head_faq1Toggle);
    function head_faq1Toggle(evt) {
      try{
        var head_expFaqSpanToHide1 = document.querySelector(".NwsrExpand");
        head_expFaqSpanToHide1.classList.toggle("NwsrExpand");
      }
      catch(err){
        thiserror = err.message;
      }
      var head_NwsrFaq1ElementID =String(head_faq1_element.getAttribute("class").split(' ')[2]) // 'this' point to the 'btn', whose class = NwsrParam OR NwsrParamSource // String(this.getAttribute("class")) // String(this.getAttribute("class").split(' ')[0])+'#'+String(this.getAttribute("class").split(' ')[1])
      var head_faqs1 = document.getElementById(head_NwsrFaq1ElementID);
      head_faqs1.classList.toggle("NwsrExpand");
      // track event
      var Nwsr_datetime = new Date()
      if (head_assessment == 'all'){
        NwsrTrackerMessage = 'NwsrTracker__clickSource__'+Nwsr_URL_tracked+'__'+Nwsr_domain_tracked+'__'+Nwsr_datetime
      }
      else if (head_assessment == 'source'){
        NwsrTrackerMessage = 'NwsrTracker__clickHistory__'+Nwsr_URL_tracked+'__'+Nwsr_domain_tracked+'__'+Nwsr_datetime
      }
      chrome.runtime.sendMessage(NwsrTrackerMessage, function(response) {
        // console.log(response)
        thiserror = err.message;
      });
    };

    // Expand corresponding 2nd element when clicked
    var head_faq2_element = document.getElementsByClassName('faq2Nwsr'+head_cleanNwsrThisElementID)[0];
    head_faq2_element.addEventListener("click", head_faq2Toggle);
    function head_faq2Toggle(evt) {
      try{
        var head_expFaqSpanToHide2 = document.querySelector(".NwsrExpand");
        head_expFaqSpanToHide2.classList.toggle("NwsrExpand");
      }
      catch(err){
        thiserror = err.message;
      }
      var head_NwsrFaq2ElementID =String(head_faq2_element.getAttribute("class").split(' ')[2]) // 'this' point to the 'btn', whose class = NwsrParam OR NwsrParamSource // String(this.getAttribute("class")) // String(this.getAttribute("class").split(' ')[0])+'#'+String(this.getAttribute("class").split(' ')[1])
      var head_faqs2 = document.getElementById(head_NwsrFaq2ElementID);
      head_faqs2.classList.toggle("NwsrExpand");
      // track event
      var Nwsr_datetime = new Date()
      if (head_assessment == 'all'){
        NwsrTrackerMessage = 'NwsrTracker__clickAuthor__'+Nwsr_URL_tracked+'__'+Nwsr_domain_tracked+'__'+Nwsr_datetime
      }
      else if (head_assessment == 'source'){
        NwsrTrackerMessage = 'NwsrTracker__clickOwnership__'+Nwsr_URL_tracked+'__'+Nwsr_domain_tracked+'__'+Nwsr_datetime
      }
      chrome.runtime.sendMessage(NwsrTrackerMessage, function(response) {
        // console.log(response)
        thiserror = err.message;
      });
    };

    try{
      // Expand corresponding 3rd element when clicked
      var head_faq3_element = document.getElementsByClassName('faq3Nwsr'+head_cleanNwsrThisElementID)[0];
      head_faq3_element.addEventListener("click", head_faq3Toggle);
      function head_faq3Toggle(evt) {
        try{
          var head_expFaqSpanToHide3 = document.querySelector(".NwsrExpand");
          head_expFaqSpanToHide3.classList.toggle("NwsrExpand");
        }
        catch(err){
          thiserror = err.message;
        }
        var head_NwsrFaq3ElementID =String(head_faq3_element.getAttribute("class").split(' ')[2]) // 'this' point to the 'btn', whose class = NwsrParam OR NwsrParamSource // String(this.getAttribute("class")) // String(this.getAttribute("class").split(' ')[0])+'#'+String(this.getAttribute("class").split(' ')[1])
        var head_faqs3 = document.getElementById(head_NwsrFaq3ElementID);
        head_faqs3.classList.toggle("NwsrExpand");
        // track event
        var Nwsr_datetime = new Date()
        NwsrTrackerMessage = 'NwsrTracker__clickRefs__'+Nwsr_URL_tracked+'__'+Nwsr_domain_tracked+'__'+Nwsr_datetime
        chrome.runtime.sendMessage(NwsrTrackerMessage, function(response) {
          // console.log(response)
          thiserror = err.message;
        });
      };

      // Expand corresponding 4th element when clicked
      var head_faq4_element = document.getElementsByClassName('faq4Nwsr'+head_cleanNwsrThisElementID)[0];
      head_faq4_element.addEventListener("click", head_faq4Toggle);
      function head_faq4Toggle(evt) {
        try{
          var head_expFaqSpanToHide4 = document.querySelector(".NwsrExpand");
          head_expFaqSpanToHide4.classList.toggle("NwsrExpand");
        }
        catch(err){
          thiserror = err.message;
        }
        var head_NwsrFaq4ElementID =String(head_faq4_element.getAttribute("class").split(' ')[2]) // 'this' point to the 'btn', whose class = NwsrParam OR NwsrParamSource // String(this.getAttribute("class")) // String(this.getAttribute("class").split(' ')[0])+'#'+String(this.getAttribute("class").split(' ')[1])
        var head_faqs4 = document.getElementById(head_NwsrFaq4ElementID);
        head_faqs4.classList.toggle("NwsrExpand");
        // track event
        var Nwsr_datetime = new Date()
        NwsrTrackerMessage = 'NwsrTracker__clickClaims__'+Nwsr_URL_tracked+'__'+Nwsr_domain_tracked+'__'+Nwsr_datetime
        chrome.runtime.sendMessage(NwsrTrackerMessage, function(response) {
          // console.log(response)
          thiserror = err.message;
        });
      };

      // Expand corresponding 5th element when clicked
      var head_faq5_element = document.getElementsByClassName('faq5Nwsr'+head_cleanNwsrThisElementID)[0];
      head_faq5_element.addEventListener("click", head_faq5Toggle);
      function head_faq5Toggle(evt) {
        try{
          var head_expFaqSpanToHide5 = document.querySelector(".NwsrExpand");
          head_expFaqSpanToHide5.classList.toggle("NwsrExpand");
        }
        catch(err){
          thiserror = err.message;
        }
        var head_NwsrFaq5ElementID =String(head_faq5_element.getAttribute("class").split(' ')[2]) // 'this' point to the 'btn', whose class = NwsrParam OR NwsrParamSource // String(this.getAttribute("class")) // String(this.getAttribute("class").split(' ')[0])+'#'+String(this.getAttribute("class").split(' ')[1])
        var head_faqs5 = document.getElementById(head_NwsrFaq5ElementID);
        head_faqs5.classList.toggle("NwsrExpand");
        // track event
        var Nwsr_datetime = new Date()
        NwsrTrackerMessage = 'NwsrTracker__clickPIR__'+Nwsr_URL_tracked+'__'+Nwsr_domain_tracked+'__'+Nwsr_datetime
        chrome.runtime.sendMessage(NwsrTrackerMessage, function(response) {
          // console.log(response)
          thiserror = err.message;
        });
      };
    }
    catch(err){
      thiserror = err.message;
    }
  }

  // Add icon, append head_btn to head_box (div where button is stored), append to body since page button will be displayed in the top left corner
  head_btn.innerHTML = head_btn_icon
  head_box.appendChild(head_btn)
  
  body.insertBefore(head_box, body.firstChild);

  // Add closing scripts
  // Add script that closes tooltip when a user clicks Esc
  body.addEventListener("click", function(event) {
    var head_divToHide = document.querySelector(".NwsrPopuptext.NwsrShow")
    var head_expSpanToHide = document.querySelector(".NwsrExpand");
    try{
      var head_isClickInsideElement = head_divToHide.contains(event.target);
      if (!head_isClickInsideElement) {
        head_divToHide.classList.toggle("NwsrShow")
        head_expSpanToHide.classList.toggle("NwsrExpand");
      }
    }
    catch(err) {
      thiserror = err.message;
    }
  });

  // Add script that closes tooltip when a user clicks Esc
  body.addEventListener("keydown", function(event) {
      if(event.key === "Escape") {
      var head_divToHide = document.querySelector(".NwsrPopuptext.NwsrShow")
      head_divToHide.classList.toggle("NwsrShow")
      var head_expEscSpanToHide = document.querySelector(".NwsrExpand");
      head_expEscSpanToHide.classList.toggle("NwsrExpand");
      }
  });
}; 





async function add_logo_article_link(article_link, original_article_link) {
  var NwsrHref = article_link
  var NwsrHrefElement = document.querySelectorAll("a[href='"+original_article_link+"']");
  try{
    var domain = article_link.replace('https://','').replaceAll('http://','').replace(/www./g,'').replace(/maps./g,'').replace(/support./g,'').replace(/myactivity./g,'').replace(/myaccount./g,'').replace(/accounts./g,'').replace(/policy./g,'').replace(/policies./g,'').replace('l.facebook','facebook').replace('m.theepochtimes','theepochtimes').replace('bbc.com','bbc.co.uk').replace('eu.usatoday','usatoday').replace('edition.cnn','cnn').split('/')[0]
    try{
      if (article_link.includes('#')){
        var article_link = article_link.substr(0, article_link.indexOf("#"))
      }
      if (article_link.includes('?')){
        var article_link = article_link.substr(0, article_link.indexOf("?"))
      }
      if (article_link.includes('&')){
        var article_link = article_link.substr(0, article_link.indexOf("&"))
      }
      var article_source_db = domain.replaceAll('rssfeeds.','').replaceAll('www.','').split('/')[0].replaceAll('.','_').replaceAll('-','_')+'_source_db'
      try{
        var assessment = 'all'
        var table = article_source_db
        var select = '*'
        var api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDAzMjI5NCwiZXhwIjoxOTQ5NjA4Mjk0fQ.5AJhHMk5HgNvqiBm9w_vCBezpCt8b3JDi-z3seAnhrc'
        var api_port = 'https://vbfzhdccxczwbluqmhtv.supabase.co/rest/v1/'+table+'?url=eq.'+article_link+'&select='+select+'&apikey='+api_key
        var raw_response = await fetchArticleScoreAsync(api_port);
        var response = raw_response[0]
        var overall_score = raw_response[2]
        var total_score_headline = raw_response[2]
        var total_score_text = raw_response[3]
        var source_score_headline = raw_response[4]
        var source_text = raw_response[5]
        var author_score_headline = raw_response[6]
        var author_text = raw_response[7]
        var ref_score_headline = raw_response[8]
        var ref_text = raw_response[9]
        var key_claims_headline = raw_response[10]
        if (key_claims_headline == 'N/A'){
          key_claims_headline = 'Claim matching score: --'
        }
        var key_claims_text = raw_response[11]
        var pir_headline = raw_response[12]
        var pir_text = raw_response[13]
        if (overall_score == 'High'){
          var color_code = '#167d39'
          var txt_color_code = '#167d39'
        }
        else if (overall_score == 'Medium'){
          var color_code = '#f9bc07'
          var txt_color_code = '#f9bc07'
        }
        else if (overall_score == 'Low'){
          var color_code = '#990000'
          var txt_color_code = '#990000'
        }
        else {
          var color_code = '#666666'
          throw 'Unable to validate article!';
        }

        var btn_icon = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg"\
           width="20pt" height="20pt" viewBox="0 0 500 500"\
           preserveAspectRatio="xMidYMid meet">\
          <g transform="translate(0.000000,500) scale(0.100000,-0.100000)"\
          fill="'+color_code+'" stroke="none">\
          <path d="M2360 4994 c-182 -13 -319 -35 -503 -84 -84 -22 -219 -65 -252 -80\
          -11 -5 -42 -19 -70 -30 -171 -74 -390 -199 -510 -292 -294 -228 -506 -467\
          -682 -773 -40 -69 -133 -260 -133 -273 0 -4 -6 -19 -14 -33 -18 -35 -70 -195\
          -95 -294 -62 -244 -75 -351 -75 -625 0 -280 12 -378 80 -645 65 -253 204 -558\
          342 -752 88 -124 118 -164 173 -224 35 -40 72 -83 82 -96 33 -42 227 -212 321\
          -282 242 -180 556 -332 838 -405 244 -64 375 -80 638 -80 311 0 451 21 765\
          116 55 17 114 36 130 43 329 145 469 228 690 409 461 379 775 931 873 1536 21\
          133 24 599 4 730 -55 363 -193 726 -385 1015 -114 171 -180 249 -343 411 -195\
          194 -393 334 -649 459 -252 123 -511 201 -781 234 -93 12 -363 21 -444 15z\
          m480 -957 c118 -24 263 -70 351 -113 85 -41 202 -108 221 -127 7 -7 26 -20 41\
          -30 64 -41 221 -192 278 -267 18 -25 36 -47 39 -50 14 -14 140 -215 140 -224\
          0 -3 13 -33 29 -68 44 -94 99 -268 118 -372 15 -79 17 -194 20 -888 l4 -798\
          -746 0 -745 0 0 370 0 370 370 0 370 0 0 383 c0 406 -4 457 -47 572 -92 243\
          -278 423 -511 490 -86 25 -88 25 -504 25 l-418 0 0 -1105 0 -1105 -370 0 -370\
          0 0 1480 0 1481 823 -4 c721 -3 832 -6 907 -20z"/>\
          </g>\
          </svg>'

        var html_content = '<header id="NwsrHeader">\
            <div>\
              <a class="NwsrLogo"><img src="https://thenewsroom.ai/wp-content/uploads/2020/11/Newsroom_logo-1.jpg" alt="The Newsroom"></a>\
            </div>\
            </header>\
            <div>\
              <h2 style="font-size:20px; font-family:sans-serif; display:block; margin-block-start:1.6em; margin-inline-start:0px; margin-inline-end:0px; font-weight:bold; color:black;">Overall score: <div style="display:inline; color:'+txt_color_code+';">'+total_score_headline+'</div></h2>\
              <p style="font-size:14px; font-family:sans-serif; display:block; margin-block-start:1em; margin-block-end:1em; margin-inline-start:0px; margin-inline-end:0px; color:black;">'+total_score_text+'</p>\
            </div>\
            <p style="padding:2px"></p>\
              <div>\
                <div>\
                  <div>\
                    <ul class="NwsrFaq-list">\
                      <li>\
                        <div class="NwsrCollapsed NwsrQuestion faq1Nwsr'+NwsrHref+'" style="font-size:16px; font-family:sans-serif; display:block; position:relative; font-weight:400; line-height:24px; color:black;">'+source_score_headline+'<i class="NwsrIcon-show"></i><i class="NwsrIcon-close"></i></div>\
                        <div id="faq1Nwsr'+NwsrHref+'" class="NwsrCollapse">\
                            <p style="font-size:14px; font-family:sans-serif; margin-bottom:0px; padding:0px; display:block; color:black;">'+source_text+'</p>\
                        </div>\
                      </li>\
                      <li>\
                        <div class="NwsrCollapsed NwsrQuestion faq2Nwsr'+NwsrHref+'" style="font-size:16px; font-family:sans-serif; display:block; position:relative; font-weight:400; line-height:24px; color:black;">'+author_score_headline+'<i class="NwsrIcon-show"></i><i class="NwsrIcon-close"></i></div>\
                        <div id="faq2Nwsr'+NwsrHref+'" class="NwsrCollapse">\
                            <p style="font-size:14px; font-family:sans-serif; margin-bottom:0px; padding:0px; display:block; color:black;">'+author_text+'</p>\
                        </div>\
                      </li>\
                      <li>\
                        <div class="NwsrCollapsed NwsrQuestion faq3Nwsr'+NwsrHref+'" style="font-size:16px; font-family:sans-serif; display:block; position:relative; font-weight:400; line-height:24px; color:black;">'+ref_score_headline+'<i class="NwsrIcon-show"></i><i class="NwsrIcon-close"></i></div>\
                        <div id="faq3Nwsr'+NwsrHref+'" class="NwsrCollapse">\
                            <p style="font-size:14px; font-family:sans-serif; margin-bottom:0px; padding:0px; display:block; color:black;">'+ref_text+'</p>\
                        </div>\
                      </li>\
                      <li>\
                        <div class="NwsrCollapsed NwsrQuestion faq4Nwsr'+NwsrHref+'" style="font-size:16px; font-family:sans-serif; display:block; position:relative; font-weight:400; line-height:24px; color:black;">'+key_claims_headline+'<i class="NwsrIcon-show"></i><i class="NwsrIcon-close"></i></div>\
                        <div id="faq4Nwsr'+NwsrHref+'" class="NwsrCollapse">\
                            <p style="font-size:14px; font-family:sans-serif; margin-bottom:0px; padding:0px; display:block; color:black;">'+key_claims_text+'</p>\
                        </div>\
                      </li>\
                      <li>\
                        <div class="NwsrCollapsed NwsrQuestion faq5Nwsr'+NwsrHref+'" style="font-size:16px; font-family:sans-serif; display:block; position:relative; font-weight:400; line-height:24px; color:black;">'+pir_headline+'<i class="NwsrIcon-show"></i><i class="NwsrIcon-close"></i></div>\
                        <div id="faq5Nwsr'+NwsrHref+'" class="NwsrCollapse">\
                            <p style="font-size:14px; font-family:sans-serif; margin-bottom:0px; padding:0px; display:block; color:black;">'+pir_text+'</p>\
                        </div>\
                      </li>\
                    </ul>\
                  </div>\
                </div>\
              </div>\
            <p style="font-size:14px; font-family:sans-serif; margin-bottom:10px; margin-top:5px; padding:0px; display:block; font-weight:bold; color:black; padding:2px">Feedback? Ideas on how to improve? Please share them <a href="https://forms.gle/8XhNjt3ESv8oCkjQ9">here</a>!</p>'
      }
      catch(err) {
        var assessment = 'source'
        var table = 'source_scores'
        var select = '*'
        var api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDAzMjI5NCwiZXhwIjoxOTQ5NjA4Mjk0fQ.5AJhHMk5HgNvqiBm9w_vCBezpCt8b3JDi-z3seAnhrc'
        var api_port = 'https://vbfzhdccxczwbluqmhtv.supabase.co/rest/v1/'+table+'?domain=eq.'+domain+'&select='+select+'&apikey='+api_key
        var source_data = await fetchSourceScoreAsync(api_port);
        var source_domain = source_data[0]
        var source_name = source_data[1]
        var source_bias = source_data[2]
        var source_score = source_data[3]
        var source_country = source_data[4]
        var source_summary = source_data[5]
        var source_link = source_data[6]
        var source_history = source_data[7]
        var source_ownership = source_data[8]
        if (source_score == 'HIGH' || source_score == 'MOSTLY FACTUAL'){
          var color_code = '#0066CC'
          var txt_color_code = '#167d39'
        }
        else if (source_score == 'MEDIUM' || source_score == 'MIXED'){
          var txt_color_code = '#f9bc07'
        }
        else if (source_score == 'LOW'){
          var txt_color_code = '#990000'
        }
        else {
          var color_code = '#666666'
        }
        var btn_icon = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg"\
           width="20pt" height="20pt" viewBox="0 0 500 500"\
           preserveAspectRatio="xMidYMid meet">\
          <g transform="translate(0.000000,500) scale(0.100000,-0.100000)"\
          fill="'+color_code+'" stroke="none">\
          <path d="M2360 4994 c-182 -13 -319 -35 -503 -84 -84 -22 -219 -65 -252 -80\
          -11 -5 -42 -19 -70 -30 -171 -74 -390 -199 -510 -292 -294 -228 -506 -467\
          -682 -773 -40 -69 -133 -260 -133 -273 0 -4 -6 -19 -14 -33 -18 -35 -70 -195\
          -95 -294 -62 -244 -75 -351 -75 -625 0 -280 12 -378 80 -645 65 -253 204 -558\
          342 -752 88 -124 118 -164 173 -224 35 -40 72 -83 82 -96 33 -42 227 -212 321\
          -282 242 -180 556 -332 838 -405 244 -64 375 -80 638 -80 311 0 451 21 765\
          116 55 17 114 36 130 43 329 145 469 228 690 409 461 379 775 931 873 1536 21\
          133 24 599 4 730 -55 363 -193 726 -385 1015 -114 171 -180 249 -343 411 -195\
          194 -393 334 -649 459 -252 123 -511 201 -781 234 -93 12 -363 21 -444 15z\
          m480 -957 c118 -24 263 -70 351 -113 85 -41 202 -108 221 -127 7 -7 26 -20 41\
          -30 64 -41 221 -192 278 -267 18 -25 36 -47 39 -50 14 -14 140 -215 140 -224\
          0 -3 13 -33 29 -68 44 -94 99 -268 118 -372 15 -79 17 -194 20 -888 l4 -798\
          -746 0 -745 0 0 370 0 370 370 0 370 0 0 383 c0 406 -4 457 -47 572 -92 243\
          -278 423 -511 490 -86 25 -88 25 -504 25 l-418 0 0 -1105 0 -1105 -370 0 -370\
          0 0 1480 0 1481 823 -4 c721 -3 832 -6 907 -20z"/>\
          </g>\
          </svg>'
        var html_content = '<header id="NwsrHeader">\
            <div>\
              <a class="NwsrLogo"><img src="https://thenewsroom.ai/wp-content/uploads/2020/11/Newsroom_logo-1.jpg" alt="The Newsroom"></a>\
            </div>\
            </header>\
            <div>\
              <h2 style="font-size:20px; font-family:sans-serif; display:block; margin-block-start:1.6em; margin-inline-start:0px; margin-inline-end:0px; font-weight:bold; color:black;">Source score: <div style="display:inline; color:'+txt_color_code+';">'+source_score+'</h2>\
              <h2 style="font-size:20px; font-family:sans-serif; display:block; margin-block-start:0.4em; margin-block-end:0.83em; margin-inline-start:0px; margin-inline-end:0px; font-weight:bold; color:black;">Political bias: '+source_bias+'</h2>\
              <p  style="font-size:14px; font-family:sans-serif; margin-bottom:0px; padding:0px; display:block; color:black;">Country of origin: '+source_country+'</h2>\
              <p  style="font-size:14px; font-family:sans-serif; margin-bottom:0px; padding:0px; display:block; color:black;">Summary (<a href="'+source_link+'">source</a>): "'+source_summary+'"</p>\
            </div>\
            <p style="padding:2px"></p>\
              <div>\
                <div>\
                  <div>\
                    <ul class="NwsrFaq-list">\
                      <li>\
                        <div class="NwsrCollapsed NwsrQuestion faq1Nwsr'+NwsrHref+'" style="font-size:16px; font-family:sans-serif; display:block; position:relative; font-weight:400; line-height:24px; color:black;">History (<a href="'+source_link+'">source</a>)<i class="NwsrIcon-show"></i><i class="NwsrIcon-close"></i></div>\
                        <div id="faq1Nwsr'+NwsrHref+'" class="NwsrCollapse">\
                            <p style="font-size:14px; font-family:sans-serif; margin-bottom:0px; padding:0px; display:block; color:black;">"'+source_history+'"</p>\
                        </div>\
                      </li>\
                      <li>\
                        <div class="NwsrCollapsed NwsrQuestion faq2Nwsr'+NwsrHref+'" style="font-size:16px; font-family:sans-serif; display:block; position:relative; font-weight:400; line-height:24px; color:black;">Ownership (<a href="'+source_link+'">source</a>)<i class="NwsrIcon-show"></i><i class="NwsrIcon-close"></i></div>\
                        <div id="faq2Nwsr'+NwsrHref+'" class="NwsrCollapse">\
                            <p style="font-size:14px; font-family:sans-serif; margin-bottom:0px; padding:0px; display:block; color:black;">"'+source_ownership+'"</p>\
                        </div>\
                      </li>\
                    </ul>\
                  </div>\
                </div>\
              </div>\
            <p style="font-size:14px; font-family:sans-serif; margin-bottom:0px; padding:0px; display:block; color:black; padding:2px">The information above was sourced from assessments made by independent non-profit news rating companies: <a href="'+source_link+'">source</a>.</p>\
            <p style="font-size:14px; font-family:sans-serif; margin-bottom:10px; margin-top:5px; padding:0px; display:block; font-weight:bold; color:black; padding:2px">Feedback? Ideas on how to improve? Please share them <a href="https://forms.gle/8XhNjt3ESv8oCkjQ9">here</a>!</p>'
      }

      // Add script that closes tooltip when a user clicks anywhere on the page outside of the tooltip
      var body = document.getElementsByTagName('body')[0];

      body.addEventListener("click", function(event) {
      var divToHide = document.querySelector(".NwsrPopuptext.NwsrShow")
      var expSpanToHide = document.querySelector(".NwsrExpand");
      try{
        var isClickInsideElement = divToHide.contains(event.target);
        if (!isClickInsideElement) {
          divToHide.classList.toggle("NwsrShow")
          expSpanToHide.classList.toggle("NwsrExpand");
        }
      }
      catch(err) {
        thiserror = err.message;
      }
      });

      // Add script that closes tooltip when a user clicks Esc
      body.addEventListener("keydown", function(event) {
          if(event.key === "Escape") {
          var divToHide = document.querySelector(".NwsrPopuptext.NwsrShow")
          divToHide.classList.toggle("NwsrShow")
          var expEscSpanToHide = document.querySelector(".NwsrExpand");
          expEscSpanToHide.classList.toggle("NwsrExpand");
          }
      });

      // Create div where we will store the buttons display The Newsroom's logo
      var box = document.createElement("div");
      box.setAttribute("class", "NwsrTooltip NwsrTooltip"+NwsrHref);

      // Create button
      var NwsrParam = "NwsrPopup"+NwsrHref; //myPopup

      var btn = document.createElement("div");
      btn.setAttribute("class", NwsrParam);

      // Create hidden tooltip
      // tooltip span
      var tooltip = document.createElement("span");
      tooltip.setAttribute("class", "NwsrPopuptext")
      tooltip.setAttribute("id", NwsrParam);
      tooltip.setAttribute("style", "overflow:scroll; top: 25%; left: 50%")
      body.appendChild(tooltip)

      // tooltip content
      var nwsr_p3 = document.createElement("section");
      nwsr_p3.setAttribute("class", "NwsrFaq")
      nwsr_p3.setAttribute("id", "NwsrFaq")
      nwsr_p3.innerHTML = html_content
      tooltip.appendChild(nwsr_p3)

      // Add listener that shows tooltip whenever a user hovers over The Newsroom's logo
      btn.addEventListener("mouseover", myNewFunction);
      function myNewFunction()
      {
        try{
          var spanToHide = document.querySelector(".NwsrPopuptext.NwsrShow");
          spanToHide.classList.toggle("NwsrShow");
        }
        catch(err){
          thiserror = err.message;
        }
        try{
          var expFaqSpanToHide = document.querySelector(".NwsrExpand");
          expFaqSpanToHide.classList.toggle("NwsrExpand");
        }
        catch(err){
          thiserror = err.message;
        }

        var NwsrThisElementID =String(this.getAttribute("class").split(' ')[0]) // 'this' point to the 'btn', whose class = NwsrParam ("popup"+NwsrHref) OR NwsrParamSource ("popup-source"+NwsrHref) // String(this.getAttribute("class")) // String(this.getAttribute("class").split(' ')[0])+'#'+String(this.getAttribute("class").split(' ')[1])
        var popup = document.getElementById(NwsrThisElementID);
        popup.classList.toggle("NwsrShow");

        // Add Non-GA event tracker
        var Nwsr_URL_tracked = spanToHide.getAttribute("id").replace('NwsrPopup','')
        var Nwsr_domain_tracked = Nwsr_URL_tracked.split('/')[0]
        var Nwsr_datetime = new Date()
        NwsrTrackerMessage = 'NwsrTracker__hover__'+Nwsr_URL_tracked+'__'+Nwsr_domain_tracked+'__'+Nwsr_datetime
        chrome.runtime.sendMessage(NwsrTrackerMessage, function(response) {
          // console.log(response)
          thiserror = err.message;
        });

        var cleanNwsrThisElementID = NwsrThisElementID.replace('NwsrPopup-source','').replace('NwsrPopup','')

        var faq1_element = document.getElementsByClassName('faq1Nwsr'+cleanNwsrThisElementID)[0];
        faq1_element.addEventListener("click", faq1Toggle);
        function faq1Toggle(evt) {
          try{
            var expFaqSpanToHide1 = document.querySelector(".NwsrExpand");
            expFaqSpanToHide1.classList.toggle("NwsrExpand");
          }
          catch(err){
            thiserror = err.message;
          }
          var NwsrFaq1ElementID =String(faq1_element.getAttribute("class").split(' ')[2]) // 'this' point to the 'btn', whose class = NwsrParam OR NwsrParamSource // String(this.getAttribute("class")) // String(this.getAttribute("class").split(' ')[0])+'#'+String(this.getAttribute("class").split(' ')[1])
          var faqs1 = document.getElementById(NwsrFaq1ElementID);
          faqs1.classList.toggle("NwsrExpand");
          // track event
          var Nwsr_datetime = new Date()
          if (assessment == 'all'){
            NwsrTrackerMessage = 'NwsrTracker__clickSource__'+Nwsr_URL_tracked+'__'+Nwsr_domain_tracked+'__'+Nwsr_datetime
          }
          else if (assessment == 'source'){
            NwsrTrackerMessage = 'NwsrTracker__clickHistory__'+Nwsr_URL_tracked+'__'+Nwsr_domain_tracked+'__'+Nwsr_datetime
          }
          chrome.runtime.sendMessage(NwsrTrackerMessage, function(response) {
            // console.log(response)
            thiserror = err.message;
          });
        };

        var faq2_element = document.getElementsByClassName('faq2Nwsr'+cleanNwsrThisElementID)[0];
        faq2_element.addEventListener("click", faq2Toggle);
        function faq2Toggle(evt) {
          try{
            var expFaqSpanToHide2 = document.querySelector(".NwsrExpand");
            expFaqSpanToHide2.classList.toggle("NwsrExpand");
          }
          catch(err){
            thiserror = err.message;
          }
          var NwsrFaq2ElementID =String(faq2_element.getAttribute("class").split(' ')[2]) // 'this' point to the 'btn', whose class = NwsrParam OR NwsrParamSource // String(this.getAttribute("class")) // String(this.getAttribute("class").split(' ')[0])+'#'+String(this.getAttribute("class").split(' ')[1])
          var faqs2 = document.getElementById(NwsrFaq2ElementID);
          faqs2.classList.toggle("NwsrExpand");
          // track event
          var Nwsr_datetime = new Date()
          if (assessment == 'all'){
            NwsrTrackerMessage = 'NwsrTracker__clickAuthor__'+Nwsr_URL_tracked+'__'+Nwsr_domain_tracked+'__'+Nwsr_datetime
          }
          else if (assessment == 'source'){
            NwsrTrackerMessage = 'NwsrTracker__clickOwnership__'+Nwsr_URL_tracked+'__'+Nwsr_domain_tracked+'__'+Nwsr_datetime
          }
          chrome.runtime.sendMessage(NwsrTrackerMessage, function(response) {
            // console.log(response)
            thiserror = err.message;
          });
        };

        try{
          var faq3_element = document.getElementsByClassName('faq3Nwsr'+cleanNwsrThisElementID)[0];
          faq3_element.addEventListener("click", faq3Toggle);
          function faq3Toggle(evt) {
            try{
              var expFaqSpanToHide3 = document.querySelector(".NwsrExpand");
              expFaqSpanToHide3.classList.toggle("NwsrExpand");
            }
            catch(err){
              thiserror = err.message;
            }
            var NwsrFaq3ElementID =String(faq3_element.getAttribute("class").split(' ')[2]) // 'this' point to the 'btn', whose class = NwsrParam OR NwsrParamSource // String(this.getAttribute("class")) // String(this.getAttribute("class").split(' ')[0])+'#'+String(this.getAttribute("class").split(' ')[1])
            var faqs3 = document.getElementById(NwsrFaq3ElementID);
            faqs3.classList.toggle("NwsrExpand");
            // track event
            var Nwsr_datetime = new Date()
            NwsrTrackerMessage = 'NwsrTracker__clickRefs__'+Nwsr_URL_tracked+'__'+Nwsr_domain_tracked+'__'+Nwsr_datetime
            chrome.runtime.sendMessage(NwsrTrackerMessage, function(response) {
              // console.log(response)
              thiserror = err.message;
            });
          };

          var faq4_element = document.getElementsByClassName('faq4Nwsr'+cleanNwsrThisElementID)[0];
          faq4_element.addEventListener("click", faq4Toggle);
          function faq4Toggle(evt) {
            try{
              var expFaqSpanToHide4 = document.querySelector(".NwsrExpand");
              expFaqSpanToHide4.classList.toggle("NwsrExpand");
            }
            catch(err){
              thiserror = err.message;
            }
            var NwsrFaq4ElementID =String(faq4_element.getAttribute("class").split(' ')[2]) // 'this' point to the 'btn', whose class = NwsrParam OR NwsrParamSource // String(this.getAttribute("class")) // String(this.getAttribute("class").split(' ')[0])+'#'+String(this.getAttribute("class").split(' ')[1])
            var faqs4 = document.getElementById(NwsrFaq4ElementID);
            faqs4.classList.toggle("NwsrExpand");
            // track event
            var Nwsr_datetime = new Date()
            NwsrTrackerMessage = 'NwsrTracker__clickClaims__'+Nwsr_URL_tracked+'__'+Nwsr_domain_tracked+'__'+Nwsr_datetime
            chrome.runtime.sendMessage(NwsrTrackerMessage, function(response) {
              // console.log(response)
              thiserror = err.message;
            });
          };

          var faq5_element = document.getElementsByClassName('faq5Nwsr'+cleanNwsrThisElementID)[0];
          faq5_element.addEventListener("click", faq5Toggle);
          function faq5Toggle(evt) {
            try{
              var expFaqSpanToHide5 = document.querySelector(".NwsrExpand");
              expFaqSpanToHide5.classList.toggle("NwsrExpand");
            }
            catch(err){
              thiserror = err.message;
            }
            var NwsrFaq5ElementID =String(faq5_element.getAttribute("class").split(' ')[2]) // 'this' point to the 'btn', whose class = NwsrParam OR NwsrParamSource // String(this.getAttribute("class")) // String(this.getAttribute("class").split(' ')[0])+'#'+String(this.getAttribute("class").split(' ')[1])
            var faqs5 = document.getElementById(NwsrFaq5ElementID);
            faqs5.classList.toggle("NwsrExpand");
            // track event
            var Nwsr_datetime = new Date()
            NwsrTrackerMessage = 'NwsrTracker__clickPIR__'+Nwsr_URL_tracked+'__'+Nwsr_domain_tracked+'__'+Nwsr_datetime
            chrome.runtime.sendMessage(NwsrTrackerMessage, function(response) {
              // console.log(response)
              thiserror = err.message;
            });
          };
        }
        catch(err) {
          thiserror = err.message;
        }
      }
      btn.innerHTML = btn_icon
      box.appendChild(btn)
      NwsrHrefElement[0].parentNode.insertBefore(box, NwsrHrefElement[0]);
    }
    catch(err) {
      thiserror = err.message;
    }
  }
  catch(err) {
    thiserror = err.message
  }
}; 






async function the_newsroom_core() {
  var head_domain = window.location.hostname.replace(/www./g,'').replace(/maps./g,'').replace(/support./g,'').replace(/myactivity./g,'').replace(/myaccount./g,'').replace(/accounts./g,'').replace(/policy./g,'').replace(/policies./g,'').replace('l.facebook','facebook').replace('m.theepochtimes','theepochtimes').replace('bbc.com','bbc.co.uk').replace('eu.usatoday','usatoday').replace('edition.cnn','cnn');

  // if the website the user is accessing is from one of the publications for which we have an assessment > run add_logo_page() for that page
  if (valid_sources.includes(head_domain)){
    var head_url = window.location.href.replace('https://','').replace('http://','')
    if( !(article_list.includes(head_url)) ) {
      add_logo_page(head_url)
      article_list.push(head_url)
    }
  }

  // Otherwise if they are accessing from Google, Facebook, or Twitter > first get the final URL > then run add_logo_article_link() for final URL
  else if ( head_domain.includes('news.google.') || head_domain.includes('facebook.com') || head_domain.includes('twitter.com') || head_domain.includes('linkedin.com') ){

    // Capture all links within the page
    if (head_domain == 'facebook.com'){
      var elements = document.querySelectorAll('[target="_blank"]');
    }
    else{
      var elements = document.querySelectorAll("a");
    }

    // For each link > clean up the domain and link
    for(var i=0; i<elements.length; i++) {
      var original_link = elements[i].href
      var original_domain = original_link.replace('https://','').replaceAll('http://','').replace(/www./g,'').replace(/maps./g,'').replace(/support./g,'').replace(/myactivity./g,'').replace(/myaccount./g,'').replace(/accounts./g,'').replace(/policy./g,'').replace(/policies./g,'').replace('l.facebook','facebook').replace('m.theepochtimes','theepochtimes').replace('bbc.com','bbc.co.uk').replace('eu.usatoday','usatoday').replace('edition.cnn','cnn').split('/')[0]
      try{
        if( !(article_list.includes(original_link)) ) {

          // If user is checking GoogleNews or the final domain is not one of the ones included in our valid_sources list (e.g. FB links) > get final url > run add_logo_article_link()
          if ( (!original_link.includes('google.com') || original_link.includes('news.google.com/articles')) && (!original_link.includes('facebook.com') || original_link.includes('https://l.facebook.com/l.php?u=')) && !original_link.includes('twitter.com') && !original_link.includes('linkedin.com') ){ // || !(valid_sources.includes(domain)) 
            
            try {
              chrome.runtime.sendMessage(original_link, function(response) {
                // alert(response)
                var first_link = response[0]
                var new_article_link_raw = response[1]
                var new_article_link = new_article_link_raw.replace('www.','').replace('https://','').replace('http://','').replace('bbc.com','bbc.co.uk').replace('eu.usatoday','usatoday').replace('edition.cnn','cnn')
                if (true){
                  (async () => {
                    await add_logo_article_link(new_article_link, first_link)
                  })();
                }
              });
            }
            catch(err){
              thiserror = err.message;
            }
          }
          article_list.push(original_link)
        }
      }
      catch(err){
        thiserror = err.message;
      }
    }
  }
  else if (head_domain.includes('google.')) {
    var elements = document.querySelectorAll("a");
    for(var i=0; i<elements.length; i++) {
      var original_link = elements[i].href
      var clean_original_link = original_link.replace('www.','').replace('https://','').replace('http://','').replace('bbc.com','bbc.co.uk').replace('eu.usatoday','usatoday').replace('edition.cnn','cnn')
      if( !(article_list.includes(original_link)) ) {
        if (true){
          (async () => {
            await add_logo_article_link(clean_original_link, original_link)
          })();
        }
        article_list.push(original_link)
      }
    }

  }
};



window.onscroll = async function() {
  try{
    await the_newsroom_core()
  }
  catch(err){
    thiserror = err.message
  }
};

window.onload = async function() {
  try{
    await the_newsroom_core()
  }
  catch(err){
    thiserror = err.message
  }
};

window.onload = async function() {
  try{
    await addCustomScripts();
  }
  catch(err){
    thiserror = err.message
  }
};

