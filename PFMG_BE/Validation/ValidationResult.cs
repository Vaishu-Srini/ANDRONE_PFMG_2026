namespace PFMG.Validation
{
    public sealed record ValidationError(string Field, string Message);

    public sealed record ValidationResult(bool IsValid, List<ValidationError> Errors)
    {
        public static ValidationResult Ok() => new(true, new());
        public static ValidationResult Fail(params ValidationError[] errs) => new(false, errs.ToList());
        public void Add(string field, string message) => Errors.Add(new(field, message));
        public override string ToString() => string.Join("; ", Errors.Select(e => $"{e.Field}: {e.Message}"));
    }
}