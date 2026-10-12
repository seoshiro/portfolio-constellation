export const newCopy = {
  "ru": {
    "sidereal": {
      "category": "Музыкальные инструменты",
      "title": "Нарисовать созвездие.\nУслышать композицию.",
      "summary": "Музыкальная обсерватория в браузере. Положение звезды задаёт время и высоту ноты, а орбитальный курсор собирает рисунок в четырёхтактовую композицию.",
      "alt": "Редактор SIDEREAL: круговая партитура, три созвездия и настройки нот",
      "detailAlt": "Редактор SIDEREAL на экране телефона",
      "input": "Добавьте звёзды на круговую партитуру и выберите для них тембр. Можно начать с готового рисунка или освоить редактор в отдельном учебном небе.",
      "output": "Композицию можно сохранить в атласе браузера, перенести через JSON или ссылку, скачать как PNG-карту или WAV с одним проигрыванием и затуханием звука.",
      "decisions": [
        "SVG связывает звёзды, список и точные параметры нот. Угол — время, радиус — высота; клавиатура и числовые настройки дополняют перетаскивание.",
        "Web Audio синтезирует три голоса. Звук запускается только по действию пользователя, аудиочасы управляют курсором, скрытая вкладка приостанавливает воспроизведение.",
        "Обучение проходит в отдельном пространстве. Локальные записи и входящие партитуры проверяются; ошибки сохранения видны, перенос через JSON не требует сервера."
      ],
      "limit": "Фиксированные четыре такта и три голоса. Нет MIDI, записи микрофона и синхронизации устройств. PNG — карта композиции, а не нотный стан; WAV содержит один проход. Качество звучания зависит от браузера и устройства.",
      "caption": "Круговая партитура SIDEREAL и панель настройки выбранной ноты."
    },
    "iter": {
      "category": "Навигация и доступность",
      "title": "Один маршрут.\nТри способа прочитать.",
      "summary": "Учебный навигатор по вымышленному зданию. Ограничения прохода, 3D-модель, схема и последовательность шагов объясняют один и тот же маршрут.",
      "alt": "ITER: условия прохода, трёхмерное здание и шаги маршрута",
      "detailAlt": "Схема маршрута ITER в 2D",
      "input": "Выберите начало и цель маршрута, минимальную ширину прохода и допустимый уклон. Можно исключить лестницы или смоделировать закрытие лифта. Все данные относятся к учебному зданию.",
      "output": "Маршрут с расстоянием, объяснением ограничений, шагами, 3D и SVG-представлением. Необходимый шаг можно выбрать в любом представлении.",
      "decisions": [
        "Планировщик фильтрует рёбра графа по условиям и ищет кратчайший доступный путь. Закрытый участок и неизвестное состояние показаны явно.",
        "Текст, SVG и Three.js используют общие идентификаторы узлов и рёбер. При отсутствии WebGL маршрут остаётся в схеме и текстовых шагах.",
        "Web Speech API озвучивает маршрут по явному запросу. Учебная стена препятствий поддерживает сообщения через существующий публичный сервис, с серверной проверкой данных."
      ],
      "limit": "Вымышленное здание и условная геометрия. Результат не подтверждает доступность реального помещения. Голоса зависят от браузера; доступность стены сообщений зависит от отдельного сервиса.",
      "caption": "Маршрут в учебном здании ITER: 3D-вид и настройки условий прохода."
    },
    "ayqyn": {
      "category": "Локальные приложения",
      "title": "Наблюдение — с контекстом.\nРешение — за человеком.",
      "summary": "Windows-прототип локального прокторинга: согласие участника, подготовка камеры, наблюдения на устройстве и отдельная проверка событий человеком.",
      "alt": "AYQYN: сведения о наблюдении и решение проверяющего",
      "detailAlt": "AYQYN: обзор и подготовка сессии",
      "input": "Подготовьте локальную сессию: получите согласие участника и выполните калибровку камеры. Для знакомства без камеры есть тестовый сценарий и браузерный повтор наблюдений.",
      "output": "Хронология наблюдений, решения проверяющего с пояснениями и JSON-отчёт без изображений.",
      "decisions": [
        "YOLO и MediaPipe обрабатывают кадры на устройстве в отдельном процессе. Согласие на обработку и сохранение снимков разделены; сохранение снимков по умолчанию выключено.",
        "Проверяющий видит длительность, число лиц, качество кадра и уверенность модели при обнаружении телефона. Он подтверждает или отклоняет наблюдение и поясняет решение.",
        "JSON-отчёт не содержит изображений. Публичный браузерный replay показывает сохранённые результаты детектора в виде схем и не запускает камеру; фотографии используются в локальном тестовом повторе."
      ],
      "limit": "Прототип для Qostanai AI Industry Hackathon 2026, кейс №3. Направление взгляда определяется приблизительно; наблюдения не доказывают нарушение и требуют проверки человеком. Это не сертифицированная экзаменационная среда. Браузерный повтор не проверяет точность работы камеры.",
      "caption": "Проверка наблюдения в AYQYN v0.2.4. Использован тестовый профиль с лицензированными фотографиями, а не снимками участников экзамена.",
      "context": "В подготовке кода, интерфейса и материалов использовался Codex. Модели YOLO и MediaPipe взяты готовыми; команда их не обучала."
    }
  },
  "en": {
    "sidereal": {
      "category": "Musical instruments",
      "title": "Draw a constellation.\nHear a composition.",
      "summary": "A musical observatory in the browser. A star’s position sets its timing and pitch; an orbital cursor turns the drawing into a four-bar composition.",
      "alt": "SIDEREAL editor with a circular score, three constellations and note settings",
      "detailAlt": "SIDEREAL editor at phone width",
      "input": "Add stars to the circular score and choose their voices. Start with a preset or learn the controls in a separate practice sky.",
      "output": "Save the composition in the browser atlas, transfer it through JSON or a link, or download a PNG map or a WAV containing one playback with release tails.",
      "decisions": [
        "SVG connects the stars, list and exact note parameters. Angle is time; radius is pitch. Keyboard and numeric controls complement dragging.",
        "Web Audio synthesizes three voices. Sound starts after a user action, the audio clock drives the cursor and a hidden page pauses playback.",
        "The guide runs in a separate practice space. Local records and incoming scores are validated; save failures are visible and JSON transfer needs no server."
      ],
      "limit": "Fixed four bars and three voices. No MIDI, microphone recording or device synchronization. PNG is a constellation score, not staff notation; WAV contains one pass. Listening quality depends on the browser and device.",
      "caption": "SIDEREAL’s circular score and settings for the selected note."
    },
    "iter": {
      "category": "Navigation and accessibility",
      "title": "One route.\nThree ways to read it.",
      "summary": "An educational navigator for a fictitious building. Passage constraints, a 3D model, an SVG plan and written steps describe the same route.",
      "alt": "ITER with passage constraints, a three-dimensional building and route steps",
      "detailAlt": "ITER route shown as a 2D plan",
      "input": "Choose a start, destination, minimum passage width and maximum slope. You can avoid stairs or simulate a lift closure. All data belongs to an educational building.",
      "output": "A route with distance, explained constraints, steps, 3D and SVG representations. Select a step from any view.",
      "decisions": [
        "The planner filters graph edges by the constraints and finds the shortest available route. Closed sections and unknown conditions are explicit.",
        "Text, SVG and Three.js share node and edge IDs. Without WebGL, the route remains available as a plan and written steps.",
        "Web Speech API reads the route on request. The educational obstacle wall sends reports through its existing public service with server validation."
      ],
      "limit": "A fictitious building and illustrative geometry. Results do not certify the accessibility of a physical space. Voices depend on the browser; the report wall depends on a separate service.",
      "caption": "A route through ITER’s educational building, with its 3D view and passage settings."
    },
    "ayqyn": {
      "category": "Local applications",
      "title": "Observe with context.\nLeave decisions to people.",
      "summary": "A Windows local proctoring prototype: participant consent, camera preparation, on-device observations and a separate human review of events.",
      "alt": "AYQYN observation details and a reviewer’s decision",
      "detailAlt": "AYQYN session overview and preparation",
      "input": "Prepare a local session with participant consent and camera calibration. A test scenario and browser replay let you explore the workflow without a camera.",
      "output": "An observation timeline, reviewer decisions with reasons, and a JSON report without images.",
      "decisions": [
        "YOLO and MediaPipe process frames on the device in a separate process. Processing and snapshot consent are separate; saving snapshots is off by default.",
        "The reviewer sees duration, face count, frame quality and model confidence for phone detection. They confirm or dismiss the observation and explain their decision.",
        "JSON reports contain no images. The public browser replay shows saved detector results as diagrams without running a camera; photographs are used in the local test replay."
      ],
      "limit": "A prototype for Qostanai AI Industry Hackathon 2026, Case 3. Gaze direction is approximate; observations do not prove misconduct and require human review. This is not a certified examination environment. Browser replay does not test camera accuracy.",
      "caption": "Reviewing an observation in AYQYN v0.2.4. The test profile uses licensed photographs, not images of exam participants.",
      "context": "Codex was used to prepare the code, interface and project materials. YOLO and MediaPipe models were used as provided; the team did not train them."
    }
  },
  "kk": {
    "sidereal": {
      "category": "Музыкалық құралдар",
      "title": "Шоқжұлдыз сал.\nӘуенін тыңда.",
      "summary": "Браузердегі музыкалық обсерватория. Жұлдыздың орны нотаның уақыты мен биіктігін анықтайды, ал орбиталық көрсеткіш суретті төрт тактілік композицияға айналдырады.",
      "alt": "SIDEREAL редакторы: дөңгелек партитура, үш шоқжұлдыз және нота параметрлері",
      "detailAlt": "Телефон экранындағы SIDEREAL редакторы",
      "input": "Дөңгелек партитураға жұлдыздар қосып, олардың тембрін таңдаңыз. Дайын үлгіден бастауға немесе бөлек оқу кеңістігінде жаттығуға болады.",
      "output": "Композицияны браузер атласына сақтауға, JSON не сілтеме арқылы тасымалдауға, PNG картасы немесе бір рет ойнатылып, дыбысы бәсеңдейтін WAV ретінде жүктеп алуға болады.",
      "decisions": [
        "SVG жұлдыздарды, тізімді және нақты параметрлерді байланыстырады. Бұрыш — уақыт, радиус — дыбыс биіктігі. Сүйреуге пернетақта мен сандық басқару балама болады.",
        "Web Audio үш дауысты синтездейді. Дыбыс тек пайдаланушы әрекетінен кейін басталады, көрсеткіш аудио сағатымен жүреді, жасырын бет ойнатуды тоқтатады.",
        "Оқу нұсқаулығы жеке кеңістікте өтеді. Жергілікті жазбалар мен кіріс партитуралар тексеріледі; сақтау қатесі көрінеді, JSON тасымалына сервер қажет емес."
      ],
      "limit": "Төрт такт пен үш дауыс. MIDI, микрофон жазбасы және құрылғылар арасындағы синхрондау жоқ. PNG — композиция картасы, нота дәптері емес; WAV бір айналымды қамтиды. Дыбыс браузер мен құрылғыға байланысты.",
      "caption": "SIDEREAL дөңгелек партитурасы және таңдалған нотаның параметрлері."
    },
    "iter": {
      "category": "Навигация және қолжетімділік",
      "title": "Бір бағыт.\nҮш түрлі көрініс.",
      "summary": "Ойдан шығарылған ғимаратқа арналған оқу навигаторы. Өту шарттары, 3D модель, SVG сызбасы және мәтіндік қадамдар бір бағытты түсіндіреді.",
      "alt": "ITER: өту шарттары, үш өлшемді ғимарат және бағыт қадамдары",
      "detailAlt": "ITER бағытының 2D сызбасы",
      "input": "Басталу нүктесін, баратын жерді, өткелдің ең аз енін және ең үлкен еңісін таңдаңыз. Баспалдақсыз бағыт іздеуге немесе лифт жабылған жағдайды модельдеуге болады. Барлық дерек оқу ғимаратына жатады.",
      "output": "Қашықтығы мен шарттары түсіндірілген бағыт, қадамдар, 3D және SVG көріністері. Қадамды кез келген көріністен таңдауға болады.",
      "decisions": [
        "Жоспарлаушы граф қырларын шарттар бойынша сүзеді және қолжетімді ең қысқа жолды табады. Жабық бөліктер мен белгісіз жағдайлар айқын көрсетіледі.",
        "Мәтін, SVG және Three.js ортақ түйіндер мен қырлардың ID-лерін қолданады. WebGL болмаса, бағыт сызба мен мәтіндік қадамдарда сақталады.",
        "Web Speech API пайдаланушы сұрағанда бағытты оқиды. Оқу кедергілер қабырғасы хабарламаларды деректерді серверде тексеретін қолданыстағы қызмет арқылы жібереді."
      ],
      "limit": "Ойдан шығарылған ғимарат пен шартты геометрия. Нәтиже нақты бөлменің қолжетімділігін растамайды. Дауыстар браузерге, хабарлама қабырғасы бөлек қызметке байланысты.",
      "caption": "ITER оқу ғимаратындағы бағыт: 3D көрініс және өту шарттарының параметрлері."
    },
    "ayqyn": {
      "category": "Жергілікті қолданбалар",
      "title": "Бақылау — контекстпен.\nШешім — адамнан.",
      "summary": "Windows-тағы жергілікті прокторинг прототипі: қатысушы келісімі, камераны дайындау, құрылғыдағы бақылаулар және оқиғаларды адамның бөлек тексеруі.",
      "alt": "AYQYN: бақылау мәліметтері және тексерушінің шешімі",
      "detailAlt": "AYQYN: сессияны шолу және дайындау",
      "input": "Жергілікті сессияны дайындаңыз: қатысушының келісімін алып, камераны калибрлеңіз. Камерасыз танысу үшін тест сценарийі мен браузердегі қайталау бар.",
      "output": "Бақылаулар хронологиясы, тексерушінің түсіндірмесі бар шешімдері және суреттерсіз JSON есебі.",
      "decisions": [
        "YOLO мен MediaPipe кадрларды құрылғыда бөлек процесте өңдейді. Өңдеуге және суреттерді сақтауға келісім бөлек беріледі; суреттерді сақтау әдепкіде өшірулі.",
        "Тексеруші ұзақтықты, беттер санын, кадр сапасын және телефонды анықтау кезіндегі модель сенімділігін көреді. Ол бақылауды растайды немесе қабылдамайды және шешімін түсіндіреді.",
        "JSON есебінде суреттер жоқ. Ашық браузерлік қайталау детектордың сақталған нәтижелерін сызба түрінде көрсетеді және камераны қоспайды; фотолар жергілікті тест қайталауында қолданылады."
      ],
      "limit": "Qostanai AI Industry Hackathon 2026 хакатонының №3 кейсіне арналған прототип. Көзқарас бағыты шамамен анықталады; бақылаулар бұзушылықты дәлелдемейді және адам тексеруін қажет етеді. Бұл сертификатталған емтихан ортасы емес. Браузердегі қайталау камераның дәлдігін тексермейді.",
      "caption": "AYQYN v0.2.4 жүйесінде бақылауды тексеру. Тест профилінде емтихан қатысушыларының суреттері емес, лицензияланған фотолар қолданылған.",
      "context": "Кодты, интерфейсті және жоба материалдарын дайындауда Codex қолданылды. YOLO мен MediaPipe модельдері дайын күйінде алынды; команда оларды оқытқан жоқ."
    }
  }
};
