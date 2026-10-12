export const interfaceCopy={
 ru:{atlas:'Карта',menu:'Меню',navigation:'Навигация',close:'Закрыть меню',soundOff:'Звук выкл',soundOn:'Звук вкл',volume:'Громкость',loading:'Загружаю атмосферу…',failed:'Звук недоступен. Можно попробовать снова.',hint:'Выберите созвездие, чтобы открыть проект.'},
 en:{atlas:'Map',menu:'Menu',navigation:'Navigation',close:'Close menu',soundOff:'Sound off',soundOn:'Sound on',volume:'Volume',loading:'Loading the atmosphere…',failed:'Sound unavailable. You can try again.',hint:'Choose a constellation to open a project.'},
 kk:{atlas:'Карта',menu:'Мәзір',navigation:'Навигация',close:'Мәзірді жабу',soundOff:'Дыбыс өшірулі',soundOn:'Дыбыс қосулы',volume:'Дыбыс деңгейі',loading:'Атмосфера жүктелуде…',failed:'Дыбыс қолжетімсіз. Қайталап көруге болады.',hint:'Жобаны ашу үшін шоқжұлдызды таңдаңыз.'}
};
export const examples={
 ru:[['sidereal','Положение становится нотой.','Угол задаёт время, расстояние от центра — высоту ноты.'],['iter','Ограничения меняют маршрут.','Ширина прохода, лестницы и лифт определяют доступные пути.'],['ayqyn','Событие получает контекст.','Длительность и причина помогают человеку проверить наблюдение.']],
 en:[['sidereal','Position becomes a note.','Angle sets time; distance from the centre sets pitch.'],['iter','Constraints change a route.','Passage width, stairs and lifts determine the available paths.'],['ayqyn','An event gains context.','Duration and reasons help a person review an observation.']],
 kk:[['sidereal','Жұлдыз орны нотаға айналады.','Бұрыш уақытты, орталықтан қашықтық нота биіктігін анықтайды.'],['iter','Шектеулер бағытты өзгертеді.','Өткел ені, баспалдақ пен лифт қолжетімді жолдарды анықтайды.'],['ayqyn','Оқиға контекст алады.','Ұзақтық пен себеп адамға бақылауды тексеруге көмектеседі.']]
};
// Only runtime audio messages enter the client bundle; the longer navigation
// and example copy is rendered into the static localized HTML.
export const audioCopy={
 ru:{soundOff:'Звук выкл',soundOn:'Звук вкл',loading:'Загружаю атмосферу…',failed:'Звук недоступен. Можно попробовать снова.'},
 en:{soundOff:'Sound off',soundOn:'Sound on',loading:'Loading the atmosphere…',failed:'Sound unavailable. You can try again.'},
 kk:{soundOff:'Дыбыс өшірулі',soundOn:'Дыбыс қосулы',loading:'Атмосфера жүктелуде…',failed:'Дыбыс қолжетімсіз. Қайталап көруге болады.'}
};
