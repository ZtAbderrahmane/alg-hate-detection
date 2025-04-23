import { useState } from 'react';
import './index.css';
import arrow from './assets/arrow.png';
import mic from './assets/mic.png';
import axios from "axios";

function App() {
  const [inputText, setInputText] = useState("");
  const [isHate, setisHate] = useState(false);
  const [hateType, setHateType] = useState("Political Hate");
  const [isOffensive, setIsOffensive] = useState(false);
  const [hateLevel, setHateLevel] = useState('متوسط ⚠️');
  const [hateSeverity, setHateSeverity] = useState(60);
  const [loading, setLoading] = useState(true);
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);
  const [message, setMessage] = useState("");


  const categoryMap = new Map([
    ["Political Hate", "كراهية سياسية 🗳️🔥"],
    ["Nationalism", "قومية ✊"],
    ["Classism", "تمييز طبقي 💰🚫"],
    ["Body shaming", "سخرية من الجسد 🧍‍♂️😔"],
    ["Sexism", "تمييز جنسي 🚺"],
    ["Regionalism", "تمييز مناطقي 🗺️🚫"],
    ["Racism", "عنصرية 🧑🏽❌"],
    ["Sectarianism", "طائفية 🕌⚔️"],
    ["Sports Hate", "كراهية رياضية ⚽😡"]
  ]);
  
  const levelMap = new Map([
    ["low", "منخفض 🟢"],
    ["mid", "متوسط ⚠️"],
    ["high", "عالي 🔴"]
  ]);
  const categoryTranslation = Object.fromEntries(categoryMap);
  const levelTranslation = Object.fromEntries(levelMap);

  const changeMessage = (m) => {
    setMessage(m);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  // State for correction form
  const [correctData, setCorrectData] = useState({
    correctIsHate: false,
    correctHateType: "كراهية سياسية 🏛️",
    correctIsOffensive: false,
    correctHateLevel: 'متوسط ⚠️',
    correctHateSeverity: 60,
    inputText: '',
  });

  const inputHandling = async () => {
    setLoading(true);

    try {
      const response = await axios.get("http://127.0.0.1:8000/predict", {
        params: {
          inputText: inputText,
        },
      });

      console.log("✅ Prediction response:", response.data);

      const { isHate, hateType, isOffensive, hateLevel, hateSeverity } = response.data;
      // Update prediction states
      setisHate(isHate);
      setHateType(hateType);
      setIsOffensive(isOffensive);
      setHateLevel(hateLevel);
      setHateSeverity(isHate ? hateSeverity : 0);

      // Also update correction form with these predictions (optional but useful)
      setCorrectData({
        correctIsHate: isHate,
        correctHateType: hateType,
        correctIsOffensive: isOffensive,
        correctHateLevel: hateLevel,
        correctHateSeverity: hateSeverity,
        inputText: inputText,
      });
      // You can use response.data to update state here later
    } catch (error) {
      console.error("❌ Error while fetching prediction:", error);
    } finally {
      setLoading(false);
    }

  };


  const validateHandling = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/correct", correctData);

      console.log("✅ Correction submitted:", response.data);
      changeMessage("تم تأكيد الإجابة بنجاح ✅");
    } catch (error) {
      console.error("❌ Error while submitting correction:", error);
      changeMessage("حدث خطأ أثناء إرسال التأكيد ❌");
    }
  };

  const correctionHandling = () => {
    // Initialize form with current values
    setCorrectData({
      correctIsHate: isHate,
      correctHateType: hateType,
      correctIsOffensive: isOffensive,
      correctHateLevel: hateLevel,
      correctHateSeverity: hateSeverity,
      inputText: inputText,
    });
    setShowCorrectionForm(true);
    changeMessage("تم إرسال تصحيح الإجابة للخادم  ✅");
  }

  const handleCorrectionSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the correction data to your backend
    try {

      console.log(correctData)
      const response = await axios.post("http://127.0.0.1:8000/correct", correctData);

      console.log("✅ Correction submitted:", response.data);
      changeMessage("تم إرسال التصحيح بنجاح ✅");
    } catch (error) {
      console.error("❌ Error while submitting correction:", error);
      changeMessage("حدث خطأ أثناء إرسال التصحيح ❌");
    }

    // Update the displayed results with correct values
    setisHate(correctData.correctIsHate);
    setHateType(correctData.correctHateType);
    setIsOffensive(correctData.correctIsOffensive);
    setHateLevel(correctData.correctHateLevel);
    setHateSeverity(correctData.correctHateSeverity);

    setShowCorrectionForm(false);
  }

  const handleCorrectionCancel = () => {
    setShowCorrectionForm(false);
  }

  const handleCorrectionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCorrectData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  //? Voice Recognition Setup
  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("متصفحك لا يدعم التعرف على الصوت.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ar-DZ";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onstart = () => {
      console.log("🎙️ تم بدء التسجيل...");
    };

    recognition.onerror = (event) => {
      console.error("❌ حدث خطأ:", event.error);
      alert("حدث خطأ أثناء التعرف على الصوت: " + event.error);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("📝 النص المحول:", transcript);
      setInputText(transcript);
    };

    recognition.onend = () => {
      console.log("🎤 تم إنهاء التسجيل.");
    };
  };

  return (
    <div dir='rtl' lang='ar' className="">
      <h1 className="">
        كشف خطاب الكراهية باللهجة الجزائرية :
      </h1>
      <div className='input'>
        <input
          type="text"
          className=""
          placeholder="أدخل أي نص  ..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div>
          <button className='mic-button' onClick={startRecognition}><img src={mic} alt="Mic" /></button>
          <button className='input-button' onClick={inputHandling}><img src={arrow} /></button>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>
      ) : (
        <>
          {showCorrectionForm ? (
            <div className="correction-form-overlay">
              <div className="correction-form">
                <h2>تصحيح النموذج :</h2>
                <form onSubmit={handleCorrectionSubmit}>
                  <div className="form-group">
                    <label>
                      هل النص يحتوي على خطاب كراهية؟
                    </label>
                    <input
                      type="checkbox"
                      name="correctIsHate"
                      checked={correctData.correctIsHate}
                      onChange={handleCorrectionChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>تصنيف خطاب الكراهية:</label>
                    <select
                      name="correctHateType"
                      value={correctData.correctHateType}
                      onChange={handleCorrectionChange}
                    >
                      <option value="Body shaming">سخرية من الجسد 🧍‍♂️😔</option>
                      <option value="Classism">تمييز طبقي 💰🚫</option>
                      <option value="Nationalism">قومية ✊</option>
                      <option value="Political Hate">كراهية سياسية 🗳️🔥</option>
                      <option value="Racism">عنصرية 🧑🏽❌</option>
                      <option value="Regionalism">تمييز مناطقي 🗺️🚫</option>
                      <option value="Sectarianism">طائفية 🕌⚔️</option>
                      <option value="Sexism">تمييز جنسي 🚺</option>
                    </select>

                  </div>

                  <div className="form-group">
                    <label>
                      هل النص يحتوي على ألفاظ مسيئة؟
                    </label>
                    <input
                      type="checkbox"
                      name="correctIsOffensive"
                      checked={correctData.correctIsOffensive}
                      onChange={handleCorrectionChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>مستوى الكراهية:</label>
                    <select
                      name="correctHateLevel"
                      value={correctData.correctHateLevel}
                      onChange={handleCorrectionChange}
                    >
                      <option value="low">منخفض 🟢</option>
                      <option value="mid">متوسط ⚠️</option>
                      <option value="high">عالي 🔴</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>درجة خطورة خطاب الكراهية:</label>
                    <input
                      type="range"
                      name="correctHateSeverity"
                      min="0"
                      max="100"
                      value={correctData.correctHateSeverity}
                      onChange={handleCorrectionChange}
                    />
                    <span>{correctData.correctHateSeverity}%</span>
                  </div>

                  <div className="form-buttons">
                    <button type="button" onClick={handleCorrectionCancel}>إلغاء ❌</button>
                    <button type="submit" >إرسال التصحيح 📤</button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <>
              <div className="results">
                <p>{isHate ? "هذا النص يحتوي على خطاب كراهية 🔴" : "هذا النص لا يحتوي على خطاب كراهية 🟢"}</p>
                <p>تصنيف خطاب الكراهية: {isHate ? categoryTranslation[hateType] : "لا يوجد"}</p>
                <p>{isOffensive ? "النص يحتوي على ألفاظ مسيئة 😡" : "النص خالٍ من الألفاظ المسيئة 😇"}</p>
                <p>مستوى الكراهية: {isHate ? levelTranslation[hateLevel] : "لا يوجد"}</p>
                <div className="severity">
                  <p>درجة خطورة خطاب الكراهية:</p>
                  <div className="bar">
                    <div className="bar-progress" style={{ width: `${hateSeverity}%` }}></div>
                  </div>
                  <span>{hateSeverity}%</span>
                </div>
              </div>

              <div className='validation'>
                <p className="">
                  يرجى مراجعة التحليل وإعلامنا إذا كنت تعتقد أن النتائج دقيقة، أو اقتراح أي تصحيحات على النموذج إذا لزم الأمر.
                </p>
                <div>
                  <button onClick={validateHandling} className='validate-button'>تأكيد الإجابة 👍</button>
                  <button onClick={correctionHandling} className='correction-button'>تصحيح النموذج 👎</button>
                  <p className='message'>{message}</p>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;