// server.js
// dotenv setup
require('dotenv').config()

// init project
const axios = require('axios');
const express = require('express');
const app = express();

// CORS
const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const mongo_url = 'mongodb://admin:admin@ds157818.mlab.com:57818/techfairla';

const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection("cover_letters");
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    // console.log(docs);
    callback(docs);
  });
}

var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var personality_insights = new PersonalityInsightsV3({
  username: process.env.WATSON_USERNAME,
  password: process.env.WATSON_PASSWORD,
  version_date: '2017-10-13',
  headers: {
    'X-Watson-Learning-Opt-Out': 'true'
  }
});

// mLab URL
var mlabURL = "https://api.mlab.com/api/1/databases/techfairla/collections/cover_letters?apiKey="+process.env.MLAB_KEY;

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  var docs = getFromMlab();
  if (docs)
    response.send(docs);
  else {
    console.log("Error: Couldn't retrieve cover letters")  
    response.sendStatus(500)
  }
});

app.get("/coverletters", function (request, response) {
  var docs = getFromMlab();
  if (docs)
    response.send(docs);
  else {
    console.log("Error: Couldn't retrieve cover letters")  
    response.sendStatus(500)
  }
});

// Reupload coverletter data dump
app.get("/resetcoverletters", function (request, response) {
  var dump = [
    {
      "coverletter": "Dear Hiring Manager:\nYour posting on LinkedIn for a Sales and Marketing Coordinator recently caught my eye, and I think you will find I am an exceptional candidate for this position.\nI am an accomplished administrative professional and a junior in the Marketing & Management program at Riverrun University. Over the past ten years, I have provided high-level support in a variety of industries and across multiple functional areas. I am now seeking a position that will make the most of my administrative experience while offering additional opportunities for personal and professional development.\nIn exchange, I offer exceptional attention to detail, highly developed communication skills, and a talent for managing complex projects with a demonstrated ability to prioritize and multitask.\nMy accomplishments and qualifications are further detailed in the attached resume. I welcome the opportunity to meet with you and discuss the value that I can bring to your organization.\nWarmest regards,\n",
      "name": "Catelyn Stark",
      "filename": "cv1",
      "favorite": 1
    },
    {
      "coverletter": "Dear Hiring Manager:\nIt is with great enthusiasm that I submit my application for the position of Sales Coordinator for the Westeros Castle Project. As an administrative professional with over ten years%u2019 experience, I know my diverse skills and qualifications will make me an asset to the Westeros project team.\nAs you will see from the attached resume, I%u2019ve built my career in a variety of roles and industries, mostly in small companies where I was not just the admin but also gatekeeper, technology whiz, bookkeeper and marketing guru. I%u2019m not only used to wearing many hats, I sincerely enjoy it; I thrive in an environment where no two work days are exactly the same.\nIn addition to being flexible and responsive, I%u2019m also a fanatic for details %u2013 particularly when it comes to presentation. One of my recent projects involved coordinating a 200-page grant proposal: I proofed and edited the narratives provided by the division head, formatted spreadsheets, and generally made sure every line was letter-perfect and that the entire finished product conformed to the specific guidelines of the RFP. (The result? A five-year, $1.5 million grant award.) I believe in applying this same level of attention to detail to tasks as visible as prepping the materials for a top-level meeting and as mundane as making sure the copier never runs out of paper.\nLast but certainly not least, I want you to know that I%u2019m a passionate Westeros fan and a longtime supporter of the new castle. I%u2019ve been following the new castle movement since the earliest days of the original %u201CSave the Tombs%u201D campaign, and I am so excited to see this vision becoming a reality. I%u2019ve already checked out the new castle website, and the renderings of the new throne and great hall are stunning, to say the least %u2013 I particularly love the vintage murals and art featured throughout the building. Nice touch!\nIn closing, I am thrilled at the possibility of being involved in the new castle almost literally from the ground up, and would love the opportunity to meet with you and discuss the value that I can bring to the Targaryen organization and the Westeros Castle Project. I appreciate your consideration and look forward to hearing from you.\nWarmest regards,",
      "name": "Catelyn Stark",
      "filename": "cv2",
      "favorite": 1
    },
    {
      "coverletter": "Dear Mr. /Mrs. /Ms. (Manager%u2019s Name)\n\nThis email is in regards to my interest in applying for the POSITION position recently posted through WEBSITE website. With my skill-set and competencies I am more than able to investigate several forensic examination processes and monitor security systems for multiple fortune 500 companies.\n\nWhile pursuing an Associate Degree in Information Security and Digital Forensics from Trident Community College, I have developed skills in reverse engineering, computer forensics, networking and information security. This knowledge has enabled me to operate in Windows and Linux platforms and master multiple security principles.\n\nI started my career as an Information Security Intern with Chicago Government in May 2011. Working under the direction of senior members, I monitored the overall security of the system and investigated likely loopholes. Utilizing my academic and professional knowledge, I dedicated two years with Technology Smart while working in the capacity of Network Operations Center Monitoring Technician. Here I gained an opportunity to work in a Datacenter environment, improve existing documentation systems and implement stringent measures to improve the overall network security.\n\nI currently work as a Security Operations Center Security Analyst with Security Professionals Inc., where I have been able to further strengthen my technical acumen.\n\nI have attached my resume highlighting my academic and professional skills and look forward to hearing from you in due course.\n\nYours sincerely",
      "name": "Bob Gate",
      "filename": "cv3",
      "favorite": 0
    },
    {
      "coverletter": "Dear Jerry,\n\nWith years of success in the industry, I am ready to join Capital Industries as your next CEO. I have a track record of identifying growth opportunities in the cloud computing industry over the past 15 years. I am seeking to leverage my exceptional company management, capital fundraising, and software application engineering abilities in a new challenge. I work well with established, talented teams to spearhead new markets.\n\nAs Chairman and CEO of Century Industries, I am responsible for providing the visionary leadership for a $10.5 million technology company offering a cloud-based Platform as a Service (PaaS) for the natural gas industry in the Midwest. My hands-on ability to work with clients in the field resulting in numerous successful partnerships.\n\nPlease review a list of my career highlights:\n\nCo-Founder and President/CEO of CloudOne, a specialized Quality of Service (QoS) Platform using PaaS business model with $35 million in total revenue %u2013 negotiated $50 million exit with Amazon Web Services.\nGrew Century Industries personnel from 50 to 250 and delivered revenue growth from $6 million to $10.4 million.\nExpanded market share for Intraserve, Inc. data access service from 30 percent to 45 percent over two years, increasing profit margins by 40 percent, with higher quality services.\nI researched into the background of Capital Industries after our initial discussions about the role. With a new market strategy, your engineers and sales teams will be a great foundation to begin creating new products. I am ready to lead Capital Industries to new heights of success.\n\nI look forward to scheduling an interview at your earliest convenience. Please call 479.668.9178 or email me at yourname@gmail.com. Thank you for your consideration.\n\nSincerely,\n\nYour Name",
      "name": "Jennifer Smith",
      "filename": "cv4",
      "favorite": 0
    },
    {
      "coverletter": "Dear Mr./Mrs./Ms. [Hiring Manager%u2019s Name],\n\nI%u2019m excited to be writing to you regarding the business analyst position advertised on (Website%u2019s Name).  With over 5 years of experience supporting business solution software and analyzing business operations, I believe that I am a perfect fit for this role.\n\nAs part of my current role as a business analyst at TECCO, I analyze client%u2019s business requirements and processes through document analysis, interviews, workshops, and workflow analysis. Using my knowledge of SQL, I further support our clients systems by conducting 5+ levels of testing including functional, regression, user acceptance, integration and performance. During my tenure with TECCO I have gained valuable knowledge of customer service, EDI standards, and risk analysis.\n\nAmong my peers, I am regarded as an analytical crackerjack with expert problem-solving skills. Furthermore, I have a proven track record of translating stakeholder requirements into tangible deliverables that exceed expectations.\n\nMy resume is enclosed, and will give you further insight into my skill sets, accomplishments, and experience in this sector. I look forward to discussing my application with you further. I appreciate your time and consideration.\n\nSincerely,",
      "name": "Melanie Blair",
      "filename": "cv5",
      "favorite": 0
    },
    {
      "coverletter": "Dear Mr. /Mrs. /Ms. (Manager%u2019s Name)\n\nWith reference to the advertisement on your website this week, I wish to apply for the role of Bookkeeper at your company.\n\nAs an analytical and dynamic individual who has a proven history of exceeding expectations through performance, I believe I would be able to participate and impact considerably tthe ongoing operational success of your company. Some of the key talents I can bring include streamlining payment systems, reducing turnover in receivables, and improving the efficiency of invoicing.\n\nMy present employment at Franklin & Rodgers Business Solutions as a General Bookkeeper has helped me to develop my abilities in key commercial areas such as financial calculations, formulating invoices, and correcting spreadsheet errors.\n\nI can combine my effective communication skills with functional knowledge to identify opportunities and deliver a satisfactory outcome while working alone or as a part of a larger team. You will find me as someone who can tackle all requisite responsibilities including administrative and customer service duties. \n\nI have enclosed my resume for your review and would be thankful for an opportunity to meet with you in the near future to discuss what I can contribute.\n\nSincerely,\n\nJack Black",
      "name": "Dwight Shret",
      "filename": "cv6",
      "favorite": 0
    },
    {
      "coverletter": "With great willingness, I am applying for the position of POSITION which was advertised on the (COMPANY NAME) website. I believe that my education, skill-set, and experience make me a suitable candidate for this vacancy.\n\nI am a highly organized and self-driven individual, passionate about developing my career in the field of Accounting as a Corporate Banker. My commitment can be gauged from the fact that I am an accredited holder of a MBA degree with finance as specialization from Poloma College.\n\nPossessing more than 5 years of experience of working in diverse financial positions with multiple companies, I have gained an extensive insight within this field. My key competencies include, but are not limited to, maintaining financial records, managing budgets, risk assessments and business strategy reviews.\n\nIn my current position with Langford Partnership where I work in the capacity of Financial Analyst, I am responsible for leading a team of 5 and carrying out a wide range of commercial processes. During the course of my career, I have gained a specialist%u2019s understanding of financial instruments and accounting software and have also been effective in explaining complex information in a comprehensible manner.\n\nAs a Certified Public Accountant, I am an accomplished communicator, with excellent organizational, decision making, and time management skills and have a proven track record of consistently meeting and regularly surpassing demanding performance goals.\n\nProactive, innovative and highly influential, I am seeking a challenging but rewarding position, which is why I was naturally drawn to this exciting opportunity.\n\nYours sincerely,",
      "name": "Mike Scott",
      "filename": "cv7",
      "favorite": 0
    },
    {
      "coverletter": "Jeff Lebowski\n\n187 Maybrook Street\nOrlando, Florida 94000\n(407)597-7891\nj.lebowski@systemsplus.com\n\nDear Mr. Lebowski\n\nI am writing to apply for the IT Project Manager position at Systems+, as advertised on Linkedin.com. I am confident that my 3 years of solid experience and diverse capabilities in project management make me an ideal candidate to successfully fulfill this position.\n\nDuring my time working as a Junior IT Project Manager at XConnect, I was the second-in-charge to the Project Manager in leading a medium-sized development team. I was charged with the responsibility of helping oversee a range of critical projects from conception to delivery.\n\nI was commended by my manager for demonstrating strong skills in: proactively managing important and time-sensitive projects; developing innovative solutions to critical problems; balancing stakeholder expectations with those of the company; and working collaboratively with other team members to establish an efficient and effective systems of operation.\n\nIn my time at XConnect, I was noted for having achieved the following:\n\nExecuting a number of highly profitable projects with budgets over $200,000\nWorking with my team to manage the accounts of prestigious international brands and clients\nStrong understanding of statistics, quality improvement techniques, FMEA and RCA\nSuccessfully contributing to Q & A testing, product SOW, integration and user documentations.\nFurthermore, I have strong academic background to ground my work. After completing my Bachelor of Information Technology Management at the University of Minnesota, I went on to score in the top 2% in my Master of Information Systems at the University of Maryland. I plan to draw on these methodologies at Systems+ to effectively complete project scheduling, issue tracking and resource management tasks.\n\nI believe that the above qualities and experiences would make me a valuable addition to your company. If there is any more information you would like me to provide, please do not hesitate to contact me.\n\nSincerely,\n\nSylvia Swanso",
      "name": "Jeff Lebowski",
      "filename": "cv8",
      "favorite": 0
    },
    {
      "coverletter": "Dear Mr./Mrs./Ms. [Hiring Manager%u2019s Name],\n\nPlease accept my enclosed application for the position of executive assistant. I found your job posting on [Website Name], and I%u2019m pleased to say that my skills match your requirements perfectly. According to your job posting, you need an experienced executive assistant who can schedule meetings, prepare agendas, and take care of daily issues without supervision.\n\nIn my current role as an executive assistant at PaxWay Incorporated, I handle all of these duties, and more, with great capability. Allow me to point to three bullet points from my resume that demonstrate both my abilities and achievements:\n\nPerform a variety of accounting activities, such as preparing between 10-20 check requests, expense reports, purchase orders, and invoices a week\nHandled all domestic and international travel reservations, cutting company%u2019s travel expenses by 12%\nOrganized 3+ monthly meetings and their logistical elements (scheduling, preparing the facility, organizing handouts and/or binders for attendees, etc.)\nI also spearheaded the movement to %u201Cgo digital,%u201D which has proven to be a significant efficiency boon for the company. I am frequently praised for my ability to handle complex tasks and solve problems without requesting input, but also maintain an awareness of when input may be desired. In short, as an executive assistant, I am efficient, attentive, and competent. Finally, I have all the basic skills necessary for the role. I type at 80WPM, am familiar with CRM systems, and have a mastery of the MS Office Suite.\n\nI am eagerly anticipating having a follow up conversation with you about how I can help make the lives of your company executives easier. Please feel free to contact me at any time.\n\nBest,\nBetty White",
      "name": "Jim Bean",
      "filename": "cv9",
      "favorite": 0
    },
    {
      "coverletter": "Dear Mr./Mrs./Ms. (Manager%u2019s Name),\n\nI%u2019m contacting you regarding your advertisement for the Human Resources opening listed on your website. My interest in this position stems from my belief that I have the right combination of relevant staffing experience, communication skills, and high levels of organization that make me a superb candidate.\n\nTo date I feel my strongest abilities are:\n\nIncreasing employee retention by rigorously maintaining a positive work environment\nDeveloping targeted outreach recruitment programs to recruit the best talent and meet all departmental hiring requirements\nCreating user-friendly application forms and questionnaires to be used by the organization during staff recruitment and interviewing.\nArbitrating labor disputes in collaboration with the legal department.\nI consider myself to be a dedicated and dependable individual who possesses excellent verbal and written communication skills. I feel that a relationship with your company would be mutually beneficial, as my educational background, HR experience, and qualifications would make me a perfect fit for your Human Resources position, and would also allow me to refine my skills in a new working environment.\n\nIn closing, I would like to thank you for your time and attention, and I hope to have the chance to discuss the opening with you in person. \n\nSincerely,\nEric Brand",
      "name": "Aaron Paul",
      "filename": "cv10",
      "favorite": 0
    },
    {
      "coverletter": "Dear Mr. Jones,\n\nI am applying for your opening for the Environmental Projects Coordinator position. I was born to get this job. Please let me explain why I am such a good match.\n\nAs a little girl, my two brothers and I used to go camping with my parents. We were taught to respect nature, and to this day there is nothing I love more than camping and the great outdoors. I even joined the girl scouts when I was young, so I could improve my camping and nature skills. I am proud to say that I earned many badges.\n\nThen, when I got older, I got caught up in trying to make money, and wound up spending the next ten years of my life working in accounting. I did well and got great reviews, but my heart wasn%u2019t in it. I used to sit and think about my next vacation, always feeling like something was missing.\n\nAnd today, when I saw the listing for your job, I knew I had to write to you. I could feel it in my bones that your organization and this job were the right direction for me %u2014 something I should have done ages ago.\n\nSince I read about your job, it%u2019s all I can think of. I really hope you are willing to give me a chance. I know if you do, I will have found the right job for me at last.\n\nPlease consider me seriously, despite my coming from a different background. I know I can do the job, and what I don%u2019t know yet I will learn quickly. Scout%u2019s honor!\n\nI can be reached at 555-555-5555 if you have any questions or want to explore this further.\n\nHopefully,\n\nDebbie Jobhunter",
      "name": "Kelly Jones",
      "filename": "cv11",
      "favorite": 0
    }
  ]

  dump.forEach(cv => {
    insertCoverLetter(cv.name, cv.filename, cv.coverletter, cv.favorite);
  })
});

// Upload and return new coverletter
app.post("/coverletters", function (request, response) {
  var name = request.body.name;
  var coverletter = request.body.coverletter;
  if (name && coverletter)
    insertCoverLetter(name, coverletter);
  else {
    console.log('Error: Name and cover letter data missing!')
    response.sendStatus(400)
  }

  if (!request.body) return response.sendStatus(400)
  // create user in req.body
  console.log(request.body);
  
  // response.sendStatus(200);
  response.send(request.body);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

function getFromMlab() {
  // Use connect method to connect to the server
  MongoClient.connect(mongo_url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    const db = client.db();

    findDocuments(db, function(docs) {
      client.close();
      return docs
    });
  });
}

function insertToMlab(data) {
  axios.post(mlabURL, data)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function insertCoverLetter(name, coverletter, filename = null, favorite = 0) {
  if (coverletter) {
    var params = {
      // Get the content from the JSON file.
      // content: require('./profile.json'), // or string
      content: coverletter,
      content_type: 'text/plain',
      consumption_preferences: true,
      raw_scores: true
    };

    personality_insights.profile(params, function(error, response) {
      if (error)
        console.log('Error:', error);
      else
        response.name = name;
        if (filename != null)
          response.filename = filename;
        response.text = coverletter;
        response.date = new Date();
        response.favorite = favorite;
        insertToMlab(response);
        console.log(JSON.stringify(response, null, 2));
    });
  } else {
    console.log('Error: Cover Letter data missing!')
  }
}
