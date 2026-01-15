namespace YourNamespace.Components;  // Change to match your project namespace

/// <summary>
/// Event arguments for the template saved event
/// </summary>
public class TemplateSavedEventArgs
{
    /// <summary>
    /// The ID of the template that was saved
    /// </summary>
    public string TemplateId { get; set; } = string.Empty;

    /// <summary>
    /// Whether the save operation was successful
    /// </summary>
    public bool Success { get; set; }
}
