import i18next from 'i18next'
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'

var english = {
  invalid_key: 'Invalid credentials',
  update_key: 'Update credentials',
  key_modal_description: 'This tool needs Watson Visual Recognition credentials.',
  sign_up: 'Sign up for bluemix to get your free credentials',
  log_out: 'Log out',
  save_key: 'Save credentials',
  mb100_error: 'Size limit (100MB) exceeded',
  invalid_file_error: 'Invalid file (must be .zip)',
  class_name: 'Class name',
  drag_zip: 'Drag .zip here to train class',
  choose_file: 'choose your file',
  negatives_tooltip: 'Negative examples should depict what the classifier is not. This set should be visually similar images to the positive examples, but do include any positive images within this negative set. You do not provide a name for this Negative class.',
  negative_class: 'Negative',
  optional: '(Optional)',
  mb2_error: 'Image size limit (10MB) exceeded',
  invalid_image_error: 'Invalid image file (must be .jpg or .png)',
  unknown_error: 'Unknown error',
  drag_image: 'Drag images here to classify them',
  choose_image: 'choose your files',
  create_classifier: 'Create classifier',
  visual_recognition_tool: 'Visual Recognition Tool',
  key: 'User',
  api_key: 'Username:Password',
  update_key_button: 'Update credentials',
  classifier_general: 'default',
  general: 'General',
  status_ready: 'ready',
  status_training: 'training',
  status_retraining: 'retraining',
  status_failed: 'failed',
  documention: 'Documentation',
  username: 'Username',
  password: 'Password',
  cancel: 'Cancel',
  ok: 'OK',

  // Create Classifier
  classifier_name_required_error: 'Classifier name is required',
  invalid_chars_error: 'Invalid characters: ',
  conflicting_class_name_error: 'Multiple classes have the same name.',
  mb250_error: 'The service accepts a maximum of 256 MB per training call.',
  add_class_error: 'Add at least one more class.',
  add_neg_or_class_error: 'Add another class, or supply negative examples.',
  no_classes_error: 'You need a minimum of 2 classes.',
  generic_error: 'An error occurred while processing your request.',
  create_classifier_title: 'Create a new classifier',
  create_classifier_description: 'Creating a custom classifier will allow you to identify highly specialized subject matter. A classifier is created from  a group of images trained by the Visual Recognition service to identify the subject matter of interest.',
  update_classifier_description: 'You can update an existing classifier by adding new classes, or by adding new images to existing classes. You must supply at least one compressed file, with additional positive or negative examples.',
  classifier_name: 'Classifier name',
  classes: 'Classes',
  classifier_requirements: 'Upload at least 2 classes, each in a zipped file with at least 10 photos.',
  add_class: 'Add class',
  cancel: 'Cancel',
  create: 'Create',
  creating_classifier: 'Creating classifier',

  // Drop button
  uploading: 'Uploading ',
  or: 'Or ',

  // Drop Down
  api_reference: 'API reference',
  update: 'Update',
  delete: 'Delete',

  // Progress Modal
  progress_modal_description: 'This may take several minutes to complete.',

  //Result List
  result_tooltip: 'This number does not represent a percentage of accuracy, but instead indicates Watson’s confidence.',
  improve_score: 'Improve this score',

  // Update Classifier
  modify_class: 'You must modify or add at least one class.',
  update_classifier: 'Update classifier',
  updating_classifier: 'Updating classifier',
}

var spanish = {
  invalid_key: 'Clave de API no válida',
  update_key: 'Actualizar clave de API',
  key_modal_description: 'Esta herramienta necesita una clave de API de Watson Visual Recognition.',
  sign_up: 'Regístrese en bluemix para obtener su clave gratis',
  log_out: 'Cerrar sesión',
  save_key: 'Guardar clave',
  mb100_error: 'Se ha superado el límite de tamaño (100 MB)',
  invalid_file_error: 'El archivo no es válido (debe ser .zip)',
  class_name: 'Nombre de clase',
  drag_zip: 'Arrastre el .zip aquí para la clase clase de entrenamiento',
  choose_file: 'elija el archivo',
  negatives_tooltip: 'No se utilizan ejemplos negativos para crear una clase dentro del clasificador creado, pero define lo que el nuevo clasificador no es. El archivo comprimido debe contener imágenes que no representan el asunto de ninguno de los ejemplos positivos.',
  negative_class: 'Negativo',
  optional: '(Opcional)',
  mb2_error: 'Se ha superado el límite de tamaño de imagen (10 MB)',
  invalid_image_error: 'Archivo de imagen no válido (debe ser .jpg o .png)',
  faces_error: 'No se ha encontrado ningún rostro',
  unknown_error: 'Error desconocido',
  drag_image: 'Arrastre aquí las imágenes para clasificarlas',
  choose_image: 'elija los archivos',
  create_classifier: 'Crear clasificador',
  visual_recognition_tool: 'Visual Recognition Tool',
  key: '🔑',
  api_key: 'Clave de API',
  update_key_button: 'Clave de actualización',
  classifier_general: 'Valor predeterminado',
  general: 'General',
  classifier_food: 'Comida',
  classifier_face: 'Detección de rostro',
  status_ready: 'preparado',
  status_training: 'entrenamiento',
  status_retraining: 'nuevo entrenamiento',
  documention: 'Documentación',

  // Create Classifier
  classifier_name_required_error: 'Es necesario el nombre de clasificador',
  invalid_chars_error: 'Caracteres no válidos: ',
  conflicting_class_name_error: 'Varias clases tienen el mismo nombre.',
  mb250_error: 'El servicio acepta un máximo de 256 MB por llamada de entrenamiento.',
  add_class_error: 'Añada al menos una clase más.',
  add_neg_or_class_error: 'Añada otra clase o suministre ejemplos negativos.',
  no_classes_error: 'Necesita un mínimo de 2 clases.',
  generic_error: 'Se ha producido un error al procesar la solicitud.',
  create_classifier_title: 'Crear un clasificador nuevo',
  create_classifier_description: 'El crear un clasificador personalizado le permitirá identificar un tema especializado. Puede entrenarlo con sus propias imágenes para crear un modelo adaptado para que se ajuste a su caso de uso exclusivo.',
  update_classifier_description: 'Puede actualizar un clasificador existente añadiendo clases o imágenes nuevas a las clases existentes. Debe suministrar al menos un archivo comprimido, con ejemplos adicionales positivos o negativos.',
  classifier_name: 'Nombre de clasificador',
  classes: 'Clases',
  classifier_requirements: 'Cargue al menos 2 clases, cada una en un archivo comprimido con al menos 10 fotografías.',
  add_class: 'Añadir clase',
  cancel: 'Cancelar',
  create: 'Crear',
  creating_classifier: 'Creando clasificador',

  // Drop button
  uploading: 'Cargando ',
  or: 'O ',

  // Drop Down
  api_reference: 'Referencia de API',
  update: 'Actualizar',
  delete: 'Suprimir',

  // Progress Modal
  progress_modal_description: 'Esto puede tardar varios minutos en completarse.',

  //Result List
  result_tooltip: 'Este número no representa un porcentaje de precisión, sino que en su lugar indica la confianza de Watson.',
  improve_score: 'Mejorar esta puntuación',

  // Update Classifier
  modify_class: 'Debe modificar o añadir al menos una clase.',
  update_classifier: 'Actualizar clasificador',
  updating_classifier: 'Actualizando clasificador'
}


var arabic = {
  invalid_key: 'مفتاح غير صحيح gواجهة تعامل برمجة التطبيق',
  update_key: 'تحديث مفتاح واجهة تعامل برمجة التطبيق',
  key_modal_description: 'تحتاج هذه الأداة الى مفتاح Watson Visual Recognition API.',
  sign_up: 'تسجيل المستخدم الى bluemix للحصول على مفتاحك المجاني',
  log_out: 'تسجيل الخروج',
  save_key: 'مفتاح الحفظ',
  mb100_error: 'تم تجاوز حد الحجم (100ميجابايت)',
  invalid_file_error: 'ملف غير صحيح (يجب أن يكون ‎.zip)',
  class_name: 'اسم الفئة',
  drag_zip: 'قم بسحب ‏.zip هنا لتدرب الفئة',
  choose_file: 'قم باختيار الملف الخاص بك',
  negatives_tooltip: 'لا يتم استخدام الأمثلة السالبة لتكوين فئة في المصنف الذي تم تكوينه، لكنها تقوم بتعريف ما لن يصبح عليه المصنف الجديد. يجب أن يتضمن الملف المضغوط صور لا تقوم بوصف موضوع أي أمثلة موجبة.',
  negative_class: 'سالب',
  optional: '(اختياري)',
  mb2_error: 'تجاوز حد حجم الصورة (2ميجابايت)',
  invalid_image_error: 'ملف صور غير صحيح (يجب أن يكون ‎.jpg أو ‎.png)',
  faces_error: 'لم يتم ايجاد أية وجوه',
  unknown_error: 'خطأ غير معروف',
  drag_image: 'سحب الصور الى هنا لتصنيفهم',
  choose_image: 'اختيار الملفات الخاصة بك',
  create_classifier: 'تكوين مصنف',
  visual_recognition_tool: 'أداة مرئية للتعرف',
  key: '🔑',
  api_key: 'مفتاح API',
  update_key_button: 'مفتاح التحديث',
  classifier_general: 'المفترض',
  general: 'عام',
  classifier_food: 'طعام',
  classifier_face: 'اكتشاف الوجوه',
  status_ready: 'جاهز للتشغيل',
  status_training: 'تدريب',
  status_retraining: 'اعادة التدريب',
  documention: 'المطبوعات الفنية',

  // Create Classifier
  classifier_name_required_error: 'مطلوب اسم المصنف',
  invalid_chars_error: 'حروف غير صحيحة: ',
  conflicting_class_name_error: 'يتوافر للفئات المتعددة نفس الاسم.',
  mb250_error: 'تقوم الخدمة بقبول بحد أقصى 256 ميجابايت لكل استدعاء تدريب.',
  add_class_error: 'قم باضافة فئة واحدة أخرى على الأقل.',
  add_neg_or_class_error: 'قم باضافة فئة أخرى، أو أدخل أمثلة سالبة.',
  no_classes_error: 'تحتاج  بحد أدنى 2 فئة.',
  generic_error: 'حدث خطأ أثناء تشغيل الطلب الخاص بك. ',
  create_classifier_title: 'تكوين مصنف جديد',
  create_classifier_description: 'ستسمح لك عملية تكوين مصنف مهيأ بتعريف الموضوعات المتخصصة للغاية. يمكنك تدريبه باستخدام الصور الخاصة بك لتكوين نموذج يتم تهيئته ليتناسب مع حالة الاستخدام المتفردة الخاصة بك.',
  update_classifier_description: 'يمكنك تحديث مصنف موجود بواسطة اضافة فئة جديدة، أو بواسطة اضافة صور جديدة لفئات موجودة. يجب أدخال ملف مضغوط واحد على الأقل، مع أمثلة اضافية موجبة أو سالبة.',
  classifier_name: 'اسم المصنف',
  classes: 'الفئات',
  classifier_requirements: 'قم بتحميل 2 فئة على الأقل، كلا منهما في ملف zip مع 10 صور على الأقل.',
  add_class: 'اضافة فئة',
  cancel: 'الغاء',
  create: 'تكوين',
  creating_classifier: 'تكوين مصنف',

  // Drop button
  uploading: 'تحميل ',
  or: 'أو ',

  // Drop Down
  api_reference: 'مرجع API',
  update: 'تحديث',
  delete: 'حذف',

  // Progress Modal
  progress_modal_description: 'قد يستغرق هذا عدة دقائق ليتم. ',

  //Result List
  result_tooltip: 'هذا الرقم لا يمثل نسبة مئوية من الدقة، ولكن بدلا من ذلك فانه يشير الى دقة Watson.',
  improve_score: 'تطوير مجموع الدرجات هذا',

  // Update Classifier
  modify_class: 'يجب تعديل أو اضافة فئة واحدة على الأقل.',
  update_classifier: 'تحديث المصنف',
  updating_classifier: 'تحديث المصنف'
}


 var german = {
  invalid_key: 'Ungültiger API-Schlüssel',
  update_key: 'Aktualisieren Sie den API-Schlüssel',
  key_modal_description: 'Dieses Tool benötigt einen API-Schlüssel für Watson Visual Recognition.',
  sign_up: 'Melden Sie sich bei Bluemix an, um einen kostenlosen Schlüssel zu erhalten',
  log_out: 'Abmelden',
  save_key: 'Schlüssel speichern',
  mb100_error: 'Größenbegrenzung (100 MB) überschritten',
  invalid_file_error: 'Ungültige Datei (ZIP erforderlich)',
  class_name: 'Klassenname',
  drag_zip: 'Ziehen Sie die ZIP-Datei hierhin, um die Klasse zu trainieren',
  choose_file: 'wählen Sie die Datei',
  negatives_tooltip: 'Negative Beispiele werden nicht zum Erstellen einer Klasse innerhalb des erstellten Klassifikationsmerkmals verwendet. Sie definieren jedoch, worum es sich beim neuen Klassifikationsmerkmal nicht handelt. Die komprimierte Datei muss Bilder enthalten, die kein Motiv eines der positiven Beispiele darstellen.',
  negative_class: 'Negativ',
  optional: '(Optional)',
  mb2_error: 'Begrenzung der Bildgröße (10 MB) überschritten',
  invalid_image_error: 'Ungültige Bilddatei (JPG oder PNG erforderlich)',
  faces_error: 'Keine Gesichter gefunden',
  unknown_error: 'Unbekannter Fehler',
  drag_image: 'Ziehen Sie Bilder hierhin, um sie zu klassifizieren',
  choose_image: 'wählen Sie die Dateien',
  create_classifier: 'Erstellen Sie ein Klassifikationsmerkmal',
  visual_recognition_tool: 'Tool für die visuelle Erkennung',
  key: '🔑',
  api_key: 'API-Schlüssel',
  update_key_button: 'Schlüssel aktualisieren',
  classifier_general: 'Standard',
  general: 'Allgemein',
  classifier_food: 'Lebensmittel',
  classifier_face: 'Gesichtserkennung',
  status_ready: 'bereit',
  status_training: 'Training',
  status_retraining: 'Erneutes Training',
  documention: 'Dokumentation',

  // Create Classifier
  classifier_name_required_error: 'Name des Klassifikationsmerkmals ist erforderlich',
  invalid_chars_error: 'Ungültige Zeichen: ',
  conflicting_class_name_error: 'Mehrere Klassen besitzen denselben Namen.',
  mb250_error: 'Der Service akzeptiert höchstens 256 MB pro Trainingsaufruf.',
  add_class_error: 'Fügen Sie mindestens eine weitere Klasse hinzu.',
  add_neg_or_class_error: 'Fügen Sie eine andere Klasse hinzu oder stellen Sie negative Beispiele bereit.',
  no_classes_error: 'Sie benötigen mindestens 2 Klassen.',
  generic_error: 'Bei der Verarbeitung Ihrer Anfrage ist ein Fehler aufgetreten.',
  create_classifier_title: 'Erstellen Sie ein neues Klassifikationsmerkmal',
  create_classifier_description: 'Indem Sie ein benutzerdefiniertes Klassifikationsmerkmal erstellen, können Sie äußerst spezifische Inhalte angeben. Sie können es mit Ihren eigenen Bildern trainieren, um ein angepasstes Modell zu erstellen, das sich für Ihren speziellen Anwendungsfall eignet.',
  update_classifier_description: 'Durch das Hinzufügen neuer Klassen oder das Hinzufügen neuer Bilder zu vorhandenen Klassen können Sie ein vorhandenes Klassifikationsmerkmal aktualisieren. Sie müssen mindestens eine komprimierte Datei mit zusätzlichen positiven oder negativen Beispielen bereitstellen.',
  classifier_name: 'Name des Klassifikationsmerkmals',
  classes: 'Klassen',
  classifier_requirements: 'Laden Sie mindestens 2 Klassen hoch - jede in einer komprimierten Datei mit mindestens 10 Fotos.',
  add_class: 'Klasse hinzufügen',
  cancel: 'Abbrechen',
  create: 'Erstellen',
  creating_classifier: 'Klassifikationsmerkmal wird erstellt',

  // Drop button
  uploading: 'Upload wird durchgeführt ',
  or: 'Oder ',

  // Drop Down
  api_reference: 'API-Referenz',
  update: 'Aktualisierungen',
  delete: 'Löschen',

  // Progress Modal
  progress_modal_description: 'Dieser Vorgang kann einige Minuten dauern.',

  //Result List
  result_tooltip: 'Diese Zahl stellt keinen Prozentsatz für die Genauigkeit dar, sondern gibt die Konfidenz von Watson an.',
  improve_score: 'Diesen Wert verbessern',

  // Update Classifier
  modify_class: 'Sie müssen mindestens eine Klasse ändern oder hinzufügen.',
  update_classifier: 'Klassifikationsmerkmal aktualisieren',
  updating_classifier: 'Klassifikationsmerkmal wird aktualisiert'
}


var italian = {
  invalid_key: 'Chiave API non valida',
  update_key: 'Aggiorna chiave API',
  key_modal_description: 'Questo strumento necessita di una chiave API di riconoscimento visivo Watson. ',
  sign_up: 'Eseguire la registrazione a bluemix per ottenere la chiave gratuita',
  log_out: 'Disconnetti',
  save_key: 'Salva chiave',
  mb100_error: 'Superato il limite di dimensione (100MB)',
  invalid_file_error: 'File non valido (deve essere .zip)',
  class_name: 'Nome classe',
  drag_zip: 'Trascinare il file .zip qui per addestrare la classe',
  choose_file: 'scegliere il file',
  negatives_tooltip: 'Gli esempi negativi non vengono utilizzati per creare una classe nel classificatore creato, ma definiscono quale non è il nuovo classificatore. Il file compresso dovrebbe contenere immagini che non rappresentino l\'oggetto degli esempi positivi. ',
  negative_class: 'Negativo',
  optional: '(Facoltativo)',
  mb2_error: 'Superato il limite di dimensione immagine (10MB)',
  invalid_image_error: 'File immagine non valido (deve essere .jpg o .png)',
  faces_error: 'Nessuna faccia trovata',
  unknown_error: 'Errore sconosciuto',
  drag_image: 'Trascinare le immagini qui per classificarle',
  choose_image: 'scegliere i file',
  create_classifier: 'Crea classificatore',
  visual_recognition_tool: 'Strumento di riconoscimento visivo',
  key: '🔑',
  api_key: 'Chiave API',
  update_key_button: 'Aggiorna chiave',
  classifier_general: 'Valore predefinito',
  general: 'Generale',
  classifier_food: 'Cibo',
  classifier_face: 'Rilevamento facciale',
  status_ready: 'pronto',
  status_training: 'in addestramento',
  status_retraining: 'in riaddestramento',
  documention: 'Documentazione',

  // Create Classifier
  classifier_name_required_error: 'È richiesto il nome classificatore',
  invalid_chars_error: 'Caratteri non validi: ',
  conflicting_class_name_error: 'Più classi hanno lo stesso nome. ',
  mb250_error: 'Il servizio accetta un massimo di 256 MB per chiamata di addestramento. ',
  add_class_error: 'Aggiungere almeno un\'altra classe. ',
  add_neg_or_class_error: 'Aggiungere un\'altra classe o fornire esempi negativi. ',
  no_classes_error: 'Occorre un minimo di 2 classi. ',
  generic_error: 'Si è verificato un errore durante l\'elaborazione della richiesta. ',
  create_classifier_title: 'Crea nuovo classificatore',
  create_classifier_description: 'La creazione di un classificatore personalizzato permetterà di identificare argomenti altamente specifici. È possibile addestrarlo con immagini proprie per creare un modello adattato al proprio caso d\'uso. ',
  update_classifier_description: 'È possibile aggiornare un classificatore esistente aggiungendo nuove classi o nuove immagini a classi esistenti. È necessario fornire almeno un file compresso con ulteriori esempi positivi e negativi. ',
  classifier_name: 'Nome classificatore',
  classes: 'Classi',
  classifier_requirements: 'Caricare almeno 2 classi, ognuna in un file .zip con almeno 10 foto. ',
  add_class: 'Aggiungi classe',
  cancel: 'Annulla',
  create: 'Crea',
  creating_classifier: 'Creazione classificatore',

  // Drop button
  uploading: 'Caricamento ',
  or: 'Oppure ',

  // Drop Down
  api_reference: 'Riferimento API',
  update: 'Aggiorna',
  delete: 'Elimina',

  // Progress Modal
  progress_modal_description: 'Il completamento potrebbe richiedere diversi minuti. ',

  //Result List
  result_tooltip: 'Questo numero non rappresenta una percentuale di precisione, ma indica invece la confidenza di Watson.',
  improve_score: 'Migliora questo punteggio',

  // Update Classifier
  modify_class: 'È necessario modificare o aggiungere almeno una classe.',
  update_classifier: 'Aggiorna classificatore',
  updating_classifier: 'Aggiornamento classificatore'
}


var japanese = {
  invalid_key: '無効な API キー',
  update_key: 'API キーの更新',
  key_modal_description: 'このツールには Watson Visual Recognition の API キーが必要です。',
  sign_up: 'Bluemix に登録して無料のキーを入手してください',
  log_out: 'ログアウト',
  save_key: 'キーの保存',
  mb100_error: '保存制限 (100MB) を超えています',
  invalid_file_error: '無効なファイルです (.zip を使用してください)',
  class_name: 'クラス名',
  drag_zip: 'ここに .zip をドラッグしてクラスをトレーニングします',
  choose_file: 'ファイルを選択してください',
  negatives_tooltip: '否定サンプルは、作成済みの種別内にクラスを作成するためには使用されませんが、新規種別に該当しないものを定義するために使用されます。この圧縮ファイルには、肯定サンプルのどの対象をも描写しないイメージを含める必要があります。',
  negative_class: '否定',
  optional: '(オプション)',
  mb2_error: 'イメージ・サイズ制限 (10MB) を超えています',
  invalid_image_error: '無効なイメージ・ファイルです (.jpg または .png を使用してください)',
  faces_error: '顔が検出されません',
  unknown_error: '不明なエラー',
  drag_image: 'ここにイメージをドラッグして分類します',
  choose_image: 'ファイルを選択してください',
  create_classifier: '種別の作成',
  visual_recognition_tool: 'Visual Recognition ツール',
  key: '🔑',
  api_key: 'API キー',
  update_key_button: 'キーの更新',
  classifier_general: 'デフォルト',
  general: '一般',
  classifier_food: '食品',
  classifier_face: '顔検出',
  status_ready: '作動可能',
  status_training: 'トレーニング',
  status_retraining: 'リトレーニング',
  documention: '資料',

  // Create Classifier
  classifier_name_required_error: '種別名は必須です',
  invalid_chars_error: '無効文字があります: ',
  conflicting_class_name_error: '複数のクラスの名前が同じです。',
  mb250_error: 'サービスでは、トレーニング呼び出しあたり最大 256 MB を受け入れます。',
  add_class_error: '少なくとも後 1 つクラスを追加してください。',
  add_neg_or_class_error: '別のクラスを追加するか、否定サンプルを提供してください。',
  no_classes_error: '少なくとも 2 つのクラスが必要です。',
  generic_error: '要求の処理中にエラーが発生しました。',
  create_classifier_title: '新規種別を作成してください',
  create_classifier_description: 'カスタム種別を作成すると、非常に特殊な対象を識別できます。この種別を独自のイメージによりトレーニングして、固有のユース・ケースに適合するように調整されたモデルを作成できます。',
  update_classifier_description: '既存の種別を更新するために、新規クラスを追加するか、または既存のクラスに新規イメージを追加できます。追加の肯定サンプルまたは否定サンプルが含まれた圧縮ファイルを、少なくとも 1 つ指定する必要があります。',
  classifier_name: '種別名',
  classes: 'クラス',
  classifier_requirements: '少なくとも 2 つのクラスをアップロードしてください。各クラスの zip ファイルには少なくとも 10 個の写真が含まれている必要があります。',
  add_class: 'クラスの追加',
  cancel: 'キャンセル',
  create: '作成',
  creating_classifier: '種別の作成中',

  // Drop button
  uploading: 'アップロード中 ',
  or: 'または ',

  // Drop Down
  api_reference: 'API リファレンス',
  update: '更新',
  delete: '削除',

  // Progress Modal
  progress_modal_description: 'これは完了までに数分かかる場合があります。',

  //Result List
  result_tooltip: 'この数値は正確度のパーセンテージではなく、Watson による信頼度を示しています。',
  improve_score: 'このスコアを改善する',

  // Update Classifier
  modify_class: '少なくとも 1 つのクラスを変更または追加してください。',
  update_classifier: '種別の更新',
  updating_classifier: '種別の更新中'
}


var korean = {
  invalid_key: '올바르지 않은 api 키',
  update_key: 'API 키 업데이트',
  key_modal_description: '이 도구에서는 Watson Visual Recognition API 키가 필요합니다. ',
  sign_up: 'Bluemix에 등록하여 무료 키 가져오기',
  log_out: '로그아웃',
  save_key: '키 저장',
  mb100_error: '크기 한계(100MB)를 초과함',
  invalid_file_error: '올바르지 않은 파일(.zip이어야 함)',
  class_name: '클래스 이름',
  drag_zip: '클래스 훈련을 위해 여기로 .zip 끌어오기',
  choose_file: '파일 선택',
  negatives_tooltip: '부정 예제는 작성된 분류자 내의 클래스 작성에는 사용되지 않지만 새 분류자가 무엇이 아닌지를 정의합니다. 압축 파일에는 긍정 예제의 주제를 묘사하지 않는 이미지가 포함되어야 합니다. ',
  negative_class: '부정',
  optional: '(선택사항)',
  mb2_error: '이미지 크기 한계(10MB)를 초과함',
  invalid_image_error: '올바르지 않은 이미지 파일(.jpg 또는 .png여야 함)',
  faces_error: '얼굴을 찾을 수 없음',
  unknown_error: '알 수 없는 오류',
  drag_image: '분류하기 위해 여기로 이미지 끌어오기',
  choose_image: '파일 선택',
  create_classifier: '분류자 작성',
  visual_recognition_tool: 'Visual Recognition 도구 ',
  key: '🔑',
  api_key: 'API 키',
  update_key_button: '키 업데이트',
  classifier_general: '기본값',
  general: '일반',
  classifier_food: '음식',
  classifier_face: '얼굴 감지',
  status_ready: '준비',
  status_training: '훈련',
  status_retraining: '재훈련',
  documention: '문서',

  // Create Classifier
  classifier_name_required_error: '분류자 이름은 필수임',
  invalid_chars_error: '올바르지 않은 문자: ',
  conflicting_class_name_error: '여러 클래스의 이름이 동일합니다. ',
  mb250_error: '서비스는 훈련 호출당 최대 256MB까지 허용합니다. ',
  add_class_error: '적어도 하나 이상의 클래스를 추가하십시오. ',
  add_neg_or_class_error: '다른 클래스를 추가하거나 부정 예제를 제공하십시오. ',
  no_classes_error: '최소 두 개의 클래스가 필요합니다. ',
  generic_error: '요청을 처리하는 중에 오류가 발생했습니다. ',
  create_classifier_title: '새 분류자 작성',
  create_classifier_description: '사용자 정의 분류자를 작성하면 고도의 전문화된 주제 항목을 식별할 수 있습니다. 자체 이미지로 이를 훈련하여 고유한 유스 케이스에 맞게 사용자 조정된 모델을 작성할 수 있습니다. ',
  update_classifier_description: '새 클래스를 추가하거나 새 이미지를 기존 클래스에 추가하여 기존 분류자를 업데이트할 수 있습니다. 추가적인 긍적 또는 부정 예제가 있는 압축 파일을 적어도 하나를 제공해야 합니다. ',
  classifier_name: '분류자 이름',
  classes: '클래스',
  classifier_requirements: '최소 10개의 사진이 포함된 압축된 파일로 각각 최소 두 개의 클래스를 업로드하십시오. ',
  add_class: '클래스 추가',
  cancel: '취소',
  create: '작성',
  creating_classifier: '분류자 작성 중',

  // Drop button
  uploading: '업로드 중 ',
  or: '또는 ',

  // Drop Down
  api_reference: 'API 참조',
  update: '업데이트',
  delete: '삭제',

  // Progress Modal
  progress_modal_description: '이를 완료하는 데는 수 분이 소요될 수 있습니다. ',

  //Result List
  result_tooltip: '이 숫자는 정확도의 백분율을 표시하지는 않는 대신에 Watson의 신뢰도를 표시합니다. ',
  improve_score: '이 점수 개선',

  // Update Classifier
  modify_class: '적어도 하나의 클래스를 수정하거나 추가해야 합니다. ',
  update_classifier: '분류자 업데이트',
  updating_classifier: '분류자 업데이트 중'
}

i18next.use(i18nextBrowserLanguageDetector).init({
    fallbackLng: 'en',
    resources: {
        en: {
            translation: english
        },
        ko: {
            translation: korean
        },
        es: {
            translation: spanish
        },
        ar: {
            translation: arabic
        },
        it: {
            translation: italian
        },
        ja: {
            translation: japanese
        },
        de: {
            translation: german
        }
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupQuerystring: "lng",
      caches: ["cookie"],
      cacheDir: 1000
    },
    debug: true
}, (err, t) => {
    if (err) return console.log('something went wrong loading', err)
})
