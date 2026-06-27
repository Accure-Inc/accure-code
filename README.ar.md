<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">简体中文</a> | <a href="README.zht.md">繁體中文</a> | <a href="README.ko.md">한국어</a> | <a href="README.de.md">Deutsch</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.it.md">Italiano</a> | <a href="README.da.md">Dansk</a> | <a href="README.ja.md">日本語</a> | <a href="README.pl.md">Polski</a> | <a href="README.ru.md">Русский</a> | <a href="README.bs.md">Bosanski</a> | العربية | <a href="README.no.md">Norsk</a> | <a href="README.br.md">Português (Brasil)</a> | <a href="README.th.md">ไทย</a> | <a href="README.tr.md">Türkçe</a> | <a href="README.uk.md">Українська</a> | <a href="README.bn.md">বাংলা</a> | <a href="README.gr.md">Ελληνικά</a> | <a href="README.vi.md">Tiếng Việt</a>
</p>

<div dir="rtl">

<p align="center">
  <a href="https://accure.ai"><img width="250" alt="Accure Code logo" src="logo.png" /></a>
</p>

<p align="center">وكيل برمجة مفتوح المصدر للبناء باستخدام الذكاء الاصطناعي في VS Code أو JetBrains أو CLI.</p>

![Accure-in-VS-Code-and-CLI](screenshot.png)

---

Accure Code هو وكيل برمجة بالذكاء الاصطناعي يعمل معك أينما تعمل: [VS Code](https://accure.ai/landing/vs-code) و[JetBrains](https://accure.ai/features/jetbrains-native) و[CLI](https://accure.ai/cli). إنه مفتوح المصدر وبتسعير مفتوح. يمكنك الاختيار من بين أكثر من 500 نموذج، والتبديل بينها أثناء المهمة، ودفع سعر مزود النموذج من دون أي هامش إضافي. لا تحتاج إلى مفاتيح API للبدء.

### التثبيت

اختر المكان الذي تريد تشغيل Accure فيه.

<details open>
<summary><strong>VS Code</strong></summary>

<br>

ثبّت [إضافة Accure Code](vscode:extension/accurecode.accure-code) مباشرة، أو احصل عليها من [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=accurecode.Accure-Code). أنشئ حسابًا وستحصل على إمكانية الوصول إلى أكثر من 500 نموذج، بما في ذلك GPT-5.5 وClaude Opus 4.7 وClaude Sonnet 4.6 وGemini 3.1 Pro Preview، كلها بسعر المزود.

</details>

<details open>
<summary><strong>CLI</strong></summary>

<br>

```bash
# npm
npm install -g @accurecode/cli

# curl
curl -fsSL https://accure.ai/cli/install | bash

# pnpm
pnpm add -g @accurecode/cli

# bun
bun add -g @accurecode/cli

# Homebrew (macOS / Linux)
brew install Accure-Org/tap/accure

# Arch Linux (AUR)
paru -S accure-bin
```

بعد ذلك شغّل `accure` في أي مجلد مشروع للبدء.

</details>

### Agents

يأتي Accure مع agents متخصصة يمكنك التبديل بينها حسب المهمة. يمكنك أيضًا إنشاء agents مخصصة خاصة بك.

- **Code** - الافتراضي. ينفذ الكود ويعدّله من اللغة الطبيعية.
- **Plan** - يصمم البنية ويكتب خطط التنفيذ قبل كتابة أي كود.
- **Ask** - يجيب عن الأسئلة حول قاعدة الكود من دون تعديل الملفات.
- **Debug** - يستكشف المشكلات ويتتبعها.
- **Review** - يراجع تغييراتك ويكشف مشكلات الأداء والأمان والأسلوب وتغطية الاختبارات.

تعرّف أكثر على [agents وagents المخصصة](https://accure.ai/docs/code-with-ai/agents/using-agents).

### ما الذي يفعله

- **توليد الكود** من اللغة الطبيعية عبر ملفات متعددة.
- **إكمال تلقائي داخل السطر** مع اقتراحات ghost-text والضغط على Tab للقبول.
- **فحص ذاتي** لكي يراجع الوكيل عمله ويصححه.
- **تحكم في الطرفية والمتصفح** لتشغيل الأوامر وأتمتة الويب.
- **سوق MCP** للعثور على خوادم MCP وربطها لتوسيع قدرات الوكيل.
- **أكثر من 500 نموذج** مع التبديل أثناء المهمة، لتطابق زمن الاستجابة والتكلفة والاستدلال مع العمل.

### الوضع المستقل (CI/CD)

شغّل `accure run` مع `--auto` للعمل بشكل مستقل بالكامل ومن دون prompts، وهو مصمم لخطوط CI/CD:

```bash
accure run --auto "run tests and fix any failures"
```

يعطّل `--auto` كل مطالبات الأذونات ويسمح للوكيل بتنفيذ أي إجراء من دون تأكيد. استخدمه فقط في بيئات موثوقة.

### التوثيق

لإعدادات التكوين وكل ما عدا ذلك، راجع [التوثيق](https://accure.ai/docs).

### المساهمة

نرحب بمساهمات المطورين والكتّاب والجميع. ابدأ بـ [Contributing Guide](/CONTRIBUTING.md) لإعداد البيئة ومعايير الكود وكيفية فتح pull request. راجع [RELEASING.md](RELEASING.md) لعملية إصدار إضافة VS Code وCLI، و[packages/accure-jetbrains/RELEASING.md](packages/accure-jetbrains/RELEASING.md) لإضافة JetBrains.

يرجى قراءة [Code of Conduct](/CODE_OF_CONDUCT.md) قبل المشاركة.

### الترخيص

MIT. يمكنك استخدام هذا الكود وتعديله وتوزيعه، بما في ذلك تجاريًا، ما دمت تحتفظ بإشعارات النسبة والترخيص. راجع [License](/LICENSE).

### FAQ

<details>
<summary>من أين جاء Accure CLI؟</summary>

Accure CLI هو fork من [OpenCode](https://github.com/Accure-Org/accurecode)، وتم تحسينه للعمل داخل منصة Accure agentic engineering.

</details>

---

**انضم إلى المجتمع** [Discord](https://accure.ai/discord) | [X](https://x.com/accurecode) | [Reddit](https://www.reddit.com/r/accurecode/)

</div>
