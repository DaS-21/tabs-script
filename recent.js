function recent(json) {document.write(''); for (var i = 0; i < numposts; i++) {var entry = json.feed.entry[i];var posttitle = entry.title.$t;var posturl;if (i == json.feed.entry.length) break;for (var k = 0; k < entry.link.length;k++){
if(entry.link[k].rel=='replies'&&entry.link[k].type=='text/html'){var commenttext=entry.link[k].title;var commenturl=entry.link[k].href;}
if (entry.link[k].rel == 'alternate') {posturl = entry.link[k].href;break;}}var thumburl;try {thumburl=entry.media.url;}catch (error)


{
s=entry.content.$t;a=s.indexOf("<img");b=s.indexOf("src=\"",a);c=s.indexOf("\"",b+5);d=s.substr(b+5,c-b-5);if((a!=-1)&&(b!=-1)&&(c!=-1)&&(d!="")){
thumburl=d;} else thumburl='http://smashingtips.com/blogger/nothumb.jpg';

}

var postdate = entry.published.$t;var cdyear = postdate.substring(0,4);var cdmonth = postdate.substring(5,7);var cdday = postdate.substring(8,10);var monthnames = new Array();monthnames[1] = "Jan";monthnames[2] = "Feb";monthnames[3] = "Mar";monthnames[4] = "Apr";monthnames[5] = "May";monthnames[6] = "Jun";monthnames[7] = "Jul";monthnames[8] = "Aug";monthnames[9] = "Sep";monthnames[10] = "Oct";monthnames[11] = "Nov";monthnames[12] = "Dec";document.write('');

document.write('<li>');

if(showpostthumbnails==true) 
document.write('<a href="'+posturl+'"><img class="thumbnail" src="'+thumburl+'" title="'+posttitle+'" alt="'+posttitle+'" style="width:48px;height:48px;"/></a>');
   

var towrite='';var flag=0;
document.write('<a href="'+posturl+'">'+posttitle+'</a>');

document.write('<span class="meta">');

if(showpostdate==true) {towrite=towrite+monthnames[parseInt(cdmonth,10)]+'-'+cdday+' - '+cdyear;flag=1;}

if(showcommentnum==true) 
{
if (flag==1) {towrite=towrite+' | ';}
if(commenttext=='1 Comments') commenttext='1 Comment';
if(commenttext=='0 Comments') commenttext='No Comments';
commenttext = '<a href="'+commenturl+'" target ="_top">'+commenttext+'</a>';
towrite=towrite+commenttext;
flag=1;
;
}

document.write(towrite);

document.write('</span></li>');

document.write('<div class="fix"></div>');
if(displayseparator==true) 
if (i!=(numposts-1))
document.write('');
}document.write('<div style="float:right;font-size:0px;bottom:0;right:0;position:absolute;"><a href="http://smashingtips.com">Blogger Tips</a></div>');



}