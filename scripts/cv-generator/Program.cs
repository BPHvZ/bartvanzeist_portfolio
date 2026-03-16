using System.Text.Json;
using QuestPDF.Drawing;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

QuestPDF.Settings.License = LicenseType.Community;

var rootDirectory = ResolveRootDirectory(args);
var dataPath = Path.Combine(rootDirectory, "content", "cv", "cv.json");
var outputPath = Path.Combine(rootDirectory, "static", "CV_-_Bart_van_Zeist.pdf");

if (!File.Exists(dataPath))
    throw new FileNotFoundException($"CV source file not found: {dataPath}");

var cvModel = LoadCvModel(dataPath);
CvValidator.Validate(cvModel, rootDirectory);

var fontResolver = new CvFontResolver();
fontResolver.RegisterFonts();

Directory.CreateDirectory(Path.GetDirectoryName(outputPath) ?? throw new InvalidOperationException("Invalid output path."));
new CvPdfDocument(cvModel, rootDirectory).GeneratePdf(outputPath);

Console.WriteLine($"Generated CV PDF at {Path.GetRelativePath(rootDirectory, outputPath)}");

static string ResolveRootDirectory(string[] commandLineArguments)
{
    var rootArgument = commandLineArguments
        .FirstOrDefault(argument => argument.StartsWith("--root=", StringComparison.OrdinalIgnoreCase));

    if (rootArgument is null)
        return Directory.GetCurrentDirectory();

    var rootPath = rootArgument.Split('=', 2)[1];
    return Path.GetFullPath(rootPath);
}

static CvModel LoadCvModel(string path)
{
    var json = File.ReadAllText(path);
    var model = JsonSerializer.Deserialize<CvModel>(json, new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    });

    return model ?? throw new InvalidOperationException($"Unable to deserialize CV model from {path}");
}

static class FontAliases
{
    public const string Name = "CvNameFont";
    public const string Mono = "CvMonoFont";
    public const string Sans = "CvSansFont";
}

sealed class CvFontResolver
{
    private static readonly string HomeDirectory = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);

    public void RegisterFonts()
    {
        Register(FontAliases.Name, ResolveFontPath(
            "CV_TEST_TIEMPOS_HEADLINE_REGULAR_PATH",
            Path.Combine(HomeDirectory, "Library", "Fonts", "TestTiemposHeadlineVF-Roman.ttf"),
            Path.Combine("/Library/Fonts", "TestTiemposHeadlineVF-Roman.ttf"),
            Path.Combine(HomeDirectory, "Library", "Fonts", "TestTiemposHeadline-Regular.otf"),
            Path.Combine("/Library/Fonts", "TestTiemposHeadline-Regular.otf")));

        Register(FontAliases.Mono, ResolveFontPath(
            "CV_SF_MONO_REGULAR_PATH",
            Path.Combine("/System/Library/Fonts", "SFNSMono.ttf"),
            Path.Combine(HomeDirectory, "Library", "Fonts", "SFMonoRegular.otf"),
            Path.Combine("/Library/Fonts", "SFMonoRegular.otf")));

        Register(FontAliases.Sans, ResolveFontPath(
            "CV_SF_PRO_TEXT_REGULAR_PATH",
            Path.Combine(HomeDirectory, "Library", "Fonts", "SFProText-Regular.ttf"),
            Path.Combine("/Library/Fonts", "SFProText-Regular.ttf"),
            Path.Combine(HomeDirectory, "Library", "Fonts", "SF-Pro-Text-Regular.otf"),
            Path.Combine("/Library/Fonts", "SF-Pro-Text-Regular.otf")));

        Register(FontAliases.Sans, ResolveFontPath(
            "CV_SF_PRO_TEXT_BOLD_PATH",
            Path.Combine(HomeDirectory, "Library", "Fonts", "SFProText-Bold.ttf"),
            Path.Combine("/Library/Fonts", "SFProText-Bold.ttf"),
            Path.Combine(HomeDirectory, "Library", "Fonts", "SF-Pro-Text-Bold.otf"),
            Path.Combine("/Library/Fonts", "SF-Pro-Text-Bold.otf")));
    }

    private static void Register(string alias, string path)
    {
        using var fontStream = File.OpenRead(path);
        FontManager.RegisterFontWithCustomName(alias, fontStream);
        Console.WriteLine($"Loaded font {alias} from {path}");
    }

    private static string ResolveFontPath(string environmentVariable, params string[] defaultPaths)
    {
        var candidates = new List<string>();
        var fromEnvironment = Environment.GetEnvironmentVariable(environmentVariable);

        if (!string.IsNullOrWhiteSpace(fromEnvironment))
            candidates.Add(fromEnvironment);

        candidates.AddRange(defaultPaths);

        var resolved = candidates
            .Where(candidate => !string.IsNullOrWhiteSpace(candidate))
            .Select(Path.GetFullPath)
            .FirstOrDefault(File.Exists);

        if (resolved is not null)
            return resolved;

        var candidateList = string.Join(Environment.NewLine, candidates.Select(candidate => $"- {candidate}"));
        throw new InvalidOperationException(
            $"Unable to resolve required font path. Set {environmentVariable} or provide one of these files:{Environment.NewLine}{candidateList}");
    }
}

sealed class CvPdfDocument : IDocument
{
    private readonly CvModel model;
    private readonly string rootDirectory;

    public CvPdfDocument(CvModel model, string rootDirectory)
    {
        this.model = model;
        this.rootDirectory = rootDirectory;
    }

    public DocumentMetadata GetMetadata()
    {
        return new DocumentMetadata
        {
            Title = model.Metadata.Title,
            Author = model.Metadata.Author,
            Subject = model.Metadata.Subject,
            Creator = model.Metadata.Creator,
            Keywords = model.Metadata.Keywords
        };
    }

    public void Compose(IDocumentContainer container)
    {
        container.Page(page =>
        {
            page.Size(PageSizes.A4);
            page.MarginTop(15);
            page.MarginBottom(20);
            page.MarginLeft(35);
            page.MarginRight(35);
            page.PageColor(model.Theme.PageBackgroundColor);
            page.DefaultTextStyle(TextStyle.Default
                .FontFamily(FontAliases.Sans)
                .FontSize(10)
                .FontColor(model.Theme.TextBodyColor));

            page.Content().ScaleToFit().Column(column =>
            {
                column.Item().Element(ComposeHeader);
                column.Item().PaddingTop(24).Element(ComposeBody);
            });
        });
    }

    private void ComposeHeader(IContainer container)
    {
        container.Column(column =>
        {
            column.Item().Row(row =>
            {
                row.RelativeItem().Column(left =>
                {
                    left.Item()
                        .PaddingTop(8)
                        .Text(model.Header.Name)
                        .FontFamily(FontAliases.Name)
                        .FontSize(46)
                        .FontColor(model.Theme.NameColor)
                        .LineHeight(1);

                    left.Item()
                        .PaddingTop(6)
                        .Text(model.Header.Subtitle)
                        .FontFamily(FontAliases.Mono)
                        .FontSize(12)
                        .FontColor(model.Theme.TextPrimaryColor)
                        .LineHeight(1);
                });

                row.ConstantItem(108)
                    .Height(108)
                    .Image(ResolvePath(model.Header.PhotoPath))
                    .FitArea();
            });

            column.Item().PaddingTop(13).Row(row =>
            {
                row.Spacing(12);

                foreach (var contact in model.Header.Contacts)
                {
                    row.AutoItem().AlignMiddle().Element(c => ComposeContact(c, contact));
                }
            });
        });
    }

    private void ComposeContact(IContainer container, CvContact contact)
    {
        container.Row(row =>
        {
            row.Spacing(6);

            row.ConstantItem(12)
                .Height(12)
                .AlignMiddle()
                .Image(ResolvePath(contact.IconPath))
                .FitArea();

            row.AutoItem().AlignMiddle().Text(text =>
            {
                text.DefaultTextStyle(TextStyle.Default
                    .FontFamily(FontAliases.Mono)
                    .FontSize(9)
                    .FontColor(model.Theme.TextPrimaryColor));

                if (!string.IsNullOrWhiteSpace(contact.Url))
                {
                    var link = text.Hyperlink(contact.Text, contact.Url);
                    if (contact.Underline)
                        link.Underline();
                }
                else
                {
                    var span = text.Span(contact.Text);
                    if (contact.Underline)
                        span.Underline();
                }
            });
        });
    }

    private void ComposeBody(IContainer container)
    {
        container.Row(row =>
        {
            row.RelativeItem().PaddingRight(26).Element(ComposeMainColumn);
            row.ConstantItem(176).Element(ComposeSidebar);
        });
    }

    private void ComposeMainColumn(IContainer container)
    {
        container.Column(column =>
        {
            column.Item().Text(model.MainColumn.Title)
                .FontFamily(FontAliases.Name)
                .FontSize(12)
                .FontColor(model.Theme.AccentColor)
                .LineHeight(1);

            for (var index = 0; index < model.MainColumn.Items.Count; index++)
            {
                var item = model.MainColumn.Items[index];

                column.Item().PaddingTop(index == 0 ? 15 : 18).Column(entryColumn =>
                {
                    entryColumn.Item().Text(text =>
                    {
                        text.Span(item.Role + " ")
                            .FontFamily(FontAliases.Sans)
                            .FontSize(10)
                            .SemiBold()
                            .FontColor(model.Theme.TextPrimaryColor);

                        text.Span($"@ {item.Organization}")
                            .FontFamily(FontAliases.Sans)
                            .FontSize(10)
                            .SemiBold()
                            .FontColor(model.Theme.TextMutedColor);
                    });

                    entryColumn.Item().PaddingTop(3)
                        .Text(item.DateLocation)
                        .FontFamily(FontAliases.Mono)
                        .FontSize(8)
                        .FontColor(model.Theme.TextPrimaryColor)
                        .LineHeight(1);

                    entryColumn.Item().PaddingTop(6).Column(bullets =>
                    {
                        bullets.Spacing(2);
                        foreach (var bullet in item.Bullets)
                            bullets.Item().Element(c => ComposeBullet(c, bullet));
                    });
                });
            }
        });
    }

    private void ComposeBullet(IContainer container, string bullet)
    {
        container.Row(row =>
        {
            row.Spacing(6);

            row.ConstantItem(8)
                .PaddingTop(1)
                .Text("▹")
                .FontFamily(FontAliases.Sans)
                .FontSize(10)
                .FontColor(model.Theme.TextBodyColor)
                .LineHeight(1);

            row.RelativeItem()
                .Text(bullet)
                .FontFamily(FontAliases.Sans)
                .FontSize(10)
                .FontColor(model.Theme.TextBodyColor)
                .LineHeight(1.22f);
        });
    }

    private void ComposeSidebar(IContainer container)
    {
        container.Column(column =>
        {
            for (var sectionIndex = 0; sectionIndex < model.Sidebar.Sections.Count; sectionIndex++)
            {
                var section = model.Sidebar.Sections[sectionIndex];

                if (sectionIndex > 0)
                    column.Item().PaddingTop(13);

                column.Item().Text(section.Title)
                    .FontFamily(FontAliases.Name)
                    .FontSize(12)
                    .FontColor(model.Theme.AccentColor)
                    .LineHeight(1);

                column.Item().PaddingTop(10).Column(groups =>
                {
                    groups.Spacing(8);

                    foreach (var group in section.Groups)
                    {
                        groups.Item().Column(groupColumn =>
                        {
                            if (!string.IsNullOrWhiteSpace(group.Heading))
                            {
                                groupColumn.Item().Text(group.Heading)
                                    .FontFamily(FontAliases.Sans)
                                    .FontSize(10)
                                    .SemiBold()
                                    .FontColor(model.Theme.TextPrimaryColor)
                                    .LineHeight(1);
                            }

                            if (!string.IsNullOrWhiteSpace(group.Meta))
                            {
                                groupColumn.Item().PaddingTop(3).Text(group.Meta)
                                    .FontFamily(FontAliases.Mono)
                                    .FontSize(8)
                                    .FontColor(model.Theme.TextPrimaryColor)
                                    .LineHeight(1);
                            }

                            if (group.Lines.Count > 0)
                            {
                                var hasHeadingOrMeta = !string.IsNullOrWhiteSpace(group.Heading) || !string.IsNullOrWhiteSpace(group.Meta);

                                groupColumn.Item().PaddingTop(hasHeadingOrMeta ? 3 : 0)
                                    .Text(string.Join("\n", group.Lines))
                                    .FontFamily(FontAliases.Sans)
                                    .FontSize(9)
                                    .FontColor(model.Theme.TextBodyColor)
                                    .LineHeight(1.22f);
                            }
                        });
                    }
                });
            }
        });
    }

    private string ResolvePath(string relativePath)
    {
        return Path.GetFullPath(Path.Combine(rootDirectory, relativePath));
    }
}

static class CvValidator
{
    public static void Validate(CvModel model, string rootDirectory)
    {
        if (string.IsNullOrWhiteSpace(model.Header.Name))
            throw new InvalidOperationException("CV header.name is required.");

        if (model.MainColumn.Items.Count == 0)
            throw new InvalidOperationException("CV mainColumn.items requires at least one item.");

        if (model.Sidebar.Sections.Count == 0)
            throw new InvalidOperationException("CV sidebar.sections requires at least one section.");

        EnsureFileExists(rootDirectory, model.Header.PhotoPath);

        foreach (var contact in model.Header.Contacts)
            EnsureFileExists(rootDirectory, contact.IconPath);
    }

    private static void EnsureFileExists(string rootDirectory, string relativePath)
    {
        var fullPath = Path.GetFullPath(Path.Combine(rootDirectory, relativePath));
        if (!File.Exists(fullPath))
            throw new FileNotFoundException($"Required CV asset not found: {fullPath}");
    }
}

sealed class CvModel
{
    public CvMetadata Metadata { get; set; } = new();
    public CvTheme Theme { get; set; } = new();
    public CvHeader Header { get; set; } = new();
    public CvExperienceSection MainColumn { get; set; } = new();
    public CvSidebar Sidebar { get; set; } = new();
}

sealed class CvMetadata
{
    public string Title { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Creator { get; set; } = string.Empty;
    public string Keywords { get; set; } = string.Empty;
}

sealed class CvTheme
{
    public string PageBackgroundColor { get; set; } = "#FFFFFF";
    public string NameColor { get; set; } = "#20A4F3";
    public string AccentColor { get; set; } = "#FF3366";
    public string TextPrimaryColor { get; set; } = "#000000";
    public string TextMutedColor { get; set; } = "#818181";
    public string TextBodyColor { get; set; } = "#636363";
}

sealed class CvHeader
{
    public string Name { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string PhotoPath { get; set; } = string.Empty;
    public List<CvContact> Contacts { get; set; } = [];
}

sealed class CvContact
{
    public string IconPath { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public bool Underline { get; set; }
}

sealed class CvExperienceSection
{
    public string Title { get; set; } = string.Empty;
    public List<CvExperienceEntry> Items { get; set; } = [];
}

sealed class CvExperienceEntry
{
    public string Role { get; set; } = string.Empty;
    public string Organization { get; set; } = string.Empty;
    public string DateLocation { get; set; } = string.Empty;
    public List<string> Bullets { get; set; } = [];
}

sealed class CvSidebar
{
    public List<CvSidebarSection> Sections { get; set; } = [];
}

sealed class CvSidebarSection
{
    public string Title { get; set; } = string.Empty;
    public List<CvSidebarGroup> Groups { get; set; } = [];
}

sealed class CvSidebarGroup
{
    public string Heading { get; set; } = string.Empty;
    public string Meta { get; set; } = string.Empty;
    public List<string> Lines { get; set; } = [];
}
