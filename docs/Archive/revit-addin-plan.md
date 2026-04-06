# Ezra Revit Addin - Build Plan

## What's Done

- **ezra-revit edge function** deployed and tested at `https://bydkzxqmgsvsnjtafphj.supabase.co/functions/v1/ezra-revit`
- Full RAG pipeline runs server-side (intent analysis, block search, relevance check, synthesis)
- Haiku/Sonnet fallback for API availability
- Endpoint accepts `{ question, history }`, returns `{ answer, sources, blocks_used }`
- Tested with "what makes a good chair" - pulled real Midland FFE pilot data with citations

## Revit Version + .NET

- **Revit 2025+** requires **.NET 8** (not .NET Framework 4.8)
- Visual Studio 2022, Class Library targeting `net8.0-windows`
- WPF is supported in .NET 8 (use `<UseWPF>true</UseWPF>` in csproj)
- Dockable panes use a WPF **Page** (not Window), implementing `IDockablePaneProvider`

Sources:
- [Revit 2025 .NET 8 Upgrade](https://help.autodesk.com/view/RVT/2025/ENU/?guid=GUID-50024FD2-16BE-40BE-96E6-550294D9537D)
- [Create a Plugin in Revit 2026 with .NET 8](https://www.aydrafting.com/case/starting-a-project-in-revit-2026-net8-api)
- [Dockable Window in Revit Add-Ins](https://twentytwo.space/2023/02/21/dockable-window-revit-add-ins-new-edition/)
- [Dockable Pane API Docs](https://help.autodesk.com/cloudhelp/2025/CHS/Revit-API/files/Revit_API_Developers_Guide/Advanced_Topics/Revit_API_Revit_API_Developers_Guide_Advanced_Topics_Dockable_Dialog_Panes_html.html)

## Project Structure

```
EzraRevit/
  EzraRevit.csproj       - Project file
  EzraRevit.addin         - Manifest (copy to Revit addins folder)
  EzraApp.cs              - IExternalApplication entry point
  ShowEzraCommand.cs      - IExternalCommand to toggle panel visibility
  EzraPanel.xaml           - WPF Page layout (chat UI)
  EzraPanel.xaml.cs        - Code-behind (HTTP calls, message state)
```

## File 1: EzraRevit.csproj

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net8.0-windows</TargetFramework>
    <UseWPF>true</UseWPF>
    <LangVersion>latest</LangVersion>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Newtonsoft.Json" Version="13.*" />
  </ItemGroup>

  <ItemGroup>
    <!-- Adjust paths to match your Revit installation -->
    <Reference Include="RevitAPI">
      <HintPath>C:\Program Files\Autodesk\Revit 2025\RevitAPI.dll</HintPath>
      <Private>false</Private>
    </Reference>
    <Reference Include="RevitAPIUI">
      <HintPath>C:\Program Files\Autodesk\Revit 2025\RevitAPIUI.dll</HintPath>
      <Private>false</Private>
    </Reference>
  </ItemGroup>

</Project>
```

**Note:** You can also use the NuGet package `Autodesk.Revit.SDK` instead of direct DLL references.

## File 2: EzraRevit.addin

Place this in `%AppData%\Autodesk\Revit\Addins\2025\` (or 2026).

```xml
<?xml version="1.0" encoding="utf-8"?>
<RevitAddIns>
  <AddIn Type="Application">
    <Name>Ezra Research Assistant</Name>
    <Assembly>path\to\EzraRevit.dll</Assembly>
    <FullClassName>EzraRevit.EzraApp</FullClassName>
    <AddInId>A1B2C3D4-E5F6-7890-ABCD-EF1234567890</AddInId>
    <VendorId>Pfluger</VendorId>
    <VendorDescription>Pfluger Architects R&amp;B</VendorDescription>
  </AddIn>
</RevitAddIns>
```

## File 3: EzraApp.cs

```csharp
using Autodesk.Revit.UI;
using Autodesk.Revit.Attributes;
using System;
using System.Reflection;
using System.Windows.Media.Imaging;

namespace EzraRevit
{
    [Transaction(TransactionMode.ReadOnly)]
    public class EzraApp : IExternalApplication
    {
        // Unique ID for the dockable pane - generate your own GUID
        public static readonly DockablePaneId PaneId =
            new DockablePaneId(new Guid("A1B2C3D4-1234-5678-9ABC-DEF012345678"));

        public Result OnStartup(UIControlledApplication app)
        {
            // Register the dockable pane
            var ezraPanel = new EzraPanel();
            app.RegisterDockablePane(PaneId, "Ezra", ezraPanel);

            // Create ribbon tab and button
            string tabName = "Pfluger R&B";
            try { app.CreateRibbonTab(tabName); } catch { /* tab may already exist */ }

            var panel = app.CreateRibbonPanel(tabName, "Research");
            var assemblyPath = Assembly.GetExecutingAssembly().Location;

            var buttonData = new PushButtonData(
                "ShowEzra",
                "Ezra",
                assemblyPath,
                "EzraRevit.ShowEzraCommand"
            );
            buttonData.ToolTip = "Open Ezra Research Assistant";

            panel.AddItem(buttonData);

            return Result.Succeeded;
        }

        public Result OnShutdown(UIControlledApplication app)
        {
            return Result.Succeeded;
        }
    }
}
```

## File 4: ShowEzraCommand.cs

```csharp
using Autodesk.Revit.UI;
using Autodesk.Revit.DB;
using Autodesk.Revit.Attributes;

namespace EzraRevit
{
    [Transaction(TransactionMode.ReadOnly)]
    public class ShowEzraCommand : IExternalCommand
    {
        public Result Execute(
            ExternalCommandData commandData,
            ref string message,
            ElementSet elements)
        {
            var pane = commandData.Application.GetDockablePane(EzraApp.PaneId);
            if (pane != null)
            {
                if (pane.IsShown())
                    pane.Hide();
                else
                    pane.Show();
            }

            return Result.Succeeded;
        }
    }
}
```

## File 5: EzraPanel.xaml

WPF **Page** (not Window) implementing IDockablePaneProvider. Dark theme.

```xml
<Page x:Class="EzraRevit.EzraPanel"
      xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
      xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
      Background="#1e1e1e">

    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>

        <!-- Header -->
        <Border Grid.Row="0" Background="#121212" Padding="16,12" BorderBrush="#2a2a2a" BorderThickness="0,0,0,1">
            <StackPanel Orientation="Horizontal">
                <Ellipse Width="32" Height="32" Margin="0,0,10,0">
                    <Ellipse.Fill>
                        <LinearGradientBrush StartPoint="0,0" EndPoint="1,1">
                            <GradientStop Color="#0ea5e9" Offset="0"/>
                            <GradientStop Color="#2563eb" Offset="1"/>
                        </LinearGradientBrush>
                    </Ellipse.Fill>
                </Ellipse>
                <StackPanel VerticalAlignment="Center">
                    <TextBlock Text="Ezra" FontSize="16" FontWeight="Bold" Foreground="White"/>
                    <TextBlock Text="Research Assistant" FontSize="10" Foreground="#6b7280"/>
                </StackPanel>
            </StackPanel>
        </Border>

        <!-- Messages -->
        <ScrollViewer Grid.Row="1" x:Name="MessagesScroller"
                      VerticalScrollBarVisibility="Auto"
                      Background="#1e1e1e"
                      Padding="12">
            <ItemsControl x:Name="MessagesList">
                <ItemsControl.ItemTemplate>
                    <DataTemplate>
                        <Border Margin="0,4" Padding="10,8"
                                CornerRadius="12"
                                MaxWidth="400"
                                HorizontalAlignment="{Binding Alignment}"
                                Background="{Binding BubbleColor}">
                            <StackPanel>
                                <TextBlock Text="{Binding Content}"
                                           Foreground="{Binding TextColor}"
                                           TextWrapping="Wrap"
                                           FontSize="13"/>
                                <!-- Sources (if any) -->
                                <ItemsControl ItemsSource="{Binding Sources}" Margin="0,4,0,0">
                                    <ItemsControl.ItemTemplate>
                                        <DataTemplate>
                                            <TextBlock Text="{Binding}"
                                                       Foreground="#6b7280"
                                                       FontSize="10"
                                                       TextWrapping="Wrap"/>
                                        </DataTemplate>
                                    </ItemsControl.ItemTemplate>
                                </ItemsControl>
                            </StackPanel>
                        </Border>
                    </DataTemplate>
                </ItemsControl.ItemTemplate>
            </ItemsControl>
        </ScrollViewer>

        <!-- Input -->
        <Border Grid.Row="2" Background="#121212" Padding="12" BorderBrush="#2a2a2a" BorderThickness="0,1,0,0">
            <Grid>
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="*"/>
                    <ColumnDefinition Width="Auto"/>
                </Grid.ColumnDefinitions>
                <TextBox x:Name="InputBox"
                         Grid.Column="0"
                         Background="#374151"
                         Foreground="White"
                         FontSize="13"
                         Padding="12,8"
                         BorderThickness="0"
                         KeyDown="InputBox_KeyDown"
                         VerticalContentAlignment="Center"/>
                <Button x:Name="SendButton"
                        Grid.Column="1"
                        Content="Send"
                        Margin="8,0,0,0"
                        Padding="16,8"
                        Background="White"
                        Foreground="Black"
                        FontWeight="SemiBold"
                        BorderThickness="0"
                        Click="SendButton_Click"/>
            </Grid>
        </Border>
    </Grid>
</Page>
```

## File 6: EzraPanel.xaml.cs

```csharp
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using Autodesk.Revit.UI;
using Newtonsoft.Json;

namespace EzraRevit
{
    // ---------------------------------------------------------------
    // View model for a single chat bubble
    // ---------------------------------------------------------------
    public class ChatBubble : INotifyPropertyChanged
    {
        public string Content { get; set; } = "";
        public string Role { get; set; } = "assistant";
        public List<string> Sources { get; set; } = new();

        // WPF binding helpers
        public HorizontalAlignment Alignment =>
            Role == "user" ? HorizontalAlignment.Right : HorizontalAlignment.Left;

        public System.Windows.Media.Brush BubbleColor =>
            Role == "user"
                ? new System.Windows.Media.SolidColorBrush(
                    System.Windows.Media.Color.FromRgb(255, 255, 255))
                : new System.Windows.Media.SolidColorBrush(
                    System.Windows.Media.Color.FromRgb(55, 65, 81));

        public System.Windows.Media.Brush TextColor =>
            Role == "user"
                ? System.Windows.Media.Brushes.Black
                : System.Windows.Media.Brushes.White;

        public event PropertyChangedEventHandler? PropertyChanged;
    }

    // ---------------------------------------------------------------
    // API response shape
    // ---------------------------------------------------------------
    public class EzraResponse
    {
        [JsonProperty("answer")]
        public string Answer { get; set; } = "";

        [JsonProperty("sources")]
        public List<EzraSource> Sources { get; set; } = new();

        [JsonProperty("blocks_used")]
        public List<string> BlocksUsed { get; set; } = new();
    }

    public class EzraSource
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; } = "";

        [JsonProperty("author")]
        public string Author { get; set; } = "";

        [JsonProperty("url")]
        public string? Url { get; set; }
    }

    // ---------------------------------------------------------------
    // The dockable panel
    // ---------------------------------------------------------------
    public partial class EzraPanel : Page, IDockablePaneProvider
    {
        // ** REPLACE with your actual anon key **
        private const string ENDPOINT =
            "https://bydkzxqmgsvsnjtafphj.supabase.co/functions/v1/ezra-revit";
        private const string ANON_KEY = "YOUR_SUPABASE_ANON_KEY_HERE";

        private static readonly HttpClient _http = new();

        private readonly ObservableCollection<ChatBubble> _bubbles = new();
        private readonly List<object> _history = new();

        public EzraPanel()
        {
            InitializeComponent();
            MessagesList.ItemsSource = _bubbles;

            // Welcome message
            _bubbles.Add(new ChatBubble
            {
                Role = "assistant",
                Content = "Hey! I'm Ezra, your research assistant. " +
                          "Ask me anything about Pfluger's design research."
            });
        }

        // IDockablePaneProvider implementation
        public void SetupDockablePane(DockablePaneProviderData data)
        {
            data.FrameworkElement = this;
            data.InitialState = new DockablePaneState
            {
                DockPosition = DockPosition.Right
            };
        }

        // ----- Event handlers -----

        private void InputBox_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter && !string.IsNullOrWhiteSpace(InputBox.Text))
            {
                _ = SendMessageAsync();
                e.Handled = true;
            }
        }

        private void SendButton_Click(object sender, RoutedEventArgs e)
        {
            if (!string.IsNullOrWhiteSpace(InputBox.Text))
            {
                _ = SendMessageAsync();
            }
        }

        // ----- Core logic -----

        private async Task SendMessageAsync()
        {
            var question = InputBox.Text.Trim();
            InputBox.Text = "";
            InputBox.IsEnabled = false;
            SendButton.IsEnabled = false;

            // Add user bubble
            _bubbles.Add(new ChatBubble { Role = "user", Content = question });
            ScrollToBottom();

            // Add typing indicator
            var typing = new ChatBubble { Role = "assistant", Content = "..." };
            _bubbles.Add(typing);
            ScrollToBottom();

            try
            {
                var response = await CallEzraAsync(question);

                // Remove typing indicator, add real response
                _bubbles.Remove(typing);

                var sources = new List<string>();
                foreach (var s in response.Sources)
                {
                    sources.Add($"[{s.Id}] {s.Author}. {s.Title}");
                }

                _bubbles.Add(new ChatBubble
                {
                    Role = "assistant",
                    Content = response.Answer,
                    Sources = sources
                });

                // Update history for context
                _history.Add(new { role = "user", content = question });
                _history.Add(new { role = "assistant", content = response.Answer });
            }
            catch (Exception ex)
            {
                _bubbles.Remove(typing);
                _bubbles.Add(new ChatBubble
                {
                    Role = "assistant",
                    Content = $"Sorry, something went wrong: {ex.Message}"
                });
            }
            finally
            {
                InputBox.IsEnabled = true;
                SendButton.IsEnabled = true;
                InputBox.Focus();
                ScrollToBottom();
            }
        }

        private async Task<EzraResponse> CallEzraAsync(string question)
        {
            var payload = new
            {
                question,
                history = _history
            };

            var json = JsonConvert.SerializeObject(payload);
            var request = new HttpRequestMessage(HttpMethod.Post, ENDPOINT)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
            request.Headers.Add("Authorization", $"Bearer {ANON_KEY}");

            var response = await _http.SendAsync(request);
            var body = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"API returned {(int)response.StatusCode}: {body}");
            }

            return JsonConvert.DeserializeObject<EzraResponse>(body)
                   ?? throw new Exception("Empty response from API");
        }

        private void ScrollToBottom()
        {
            MessagesScroller.ScrollToEnd();
        }
    }
}
```

## Setup Steps

1. Open Visual Studio 2022, create new Class Library (.NET 8)
2. Copy the files above into the project
3. Adjust `HintPath` in csproj to your Revit install location (or use the `Autodesk.Revit.SDK` NuGet)
4. Replace `YOUR_SUPABASE_ANON_KEY_HERE` in EzraPanel.xaml.cs with the actual key from `.env.local`
5. Generate a real GUID for `AddInId` in the .addin file and `PaneId` in EzraApp.cs
6. Build the project
7. Copy `EzraRevit.addin` to `%AppData%\Autodesk\Revit\Addins\2025\`
8. Update the `<Assembly>` path in the .addin to point to your built DLL
9. Launch Revit, find "Pfluger R&B" tab, click "Ezra"

## API Contract

```
POST https://bydkzxqmgsvsnjtafphj.supabase.co/functions/v1/ezra-revit

Headers:
  Authorization: Bearer <ANON_KEY>
  Content-Type: application/json

Request:
{
  "question": "what makes a good chair",
  "history": [
    { "role": "user", "content": "previous question" },
    { "role": "assistant", "content": "previous answer" }
  ]
}

Response:
{
  "answer": "Ezra's response with [1] citations...",
  "sources": [
    { "id": 1, "title": "...", "author": "...", "url": "..." }
  ],
  "blocks_used": ["block-id-1"]
}
```

## Build Order

1. Alex: get Visual Studio + Revit SDK set up, create the project
2. Drop in the 6 files above
3. Set the anon key, generate GUIDs, adjust DLL paths
4. Build and load in Revit
5. Test: ask "what makes a good chair" from inside Revit

## Future (Post-Demo)

- **MCP integration**: AI reads selected elements, room context, project info from Revit model
- **Element tagging**: link Revit elements to Repository research project IDs
- **Chat persistence**: save/load conversations (could use the same pitch_ai_sessions pattern)
- **Revit context injection**: pass building type, active view, selected element to the endpoint
