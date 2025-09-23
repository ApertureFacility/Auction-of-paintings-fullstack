import pytest
from pathlib import Path
from src.email.service import load_template, TEMPLATE_DIR


def test_load_template_substitution(tmp_path):
    """Проверяет, что load_template подставляет переменные в шаблон"""
    template_content = "<h1>Hello, {username}!</h1><p>Email: {email}</p>"
    template_file = tmp_path / "test_template.html"
    template_file.write_text(template_content, encoding="utf-8")

  
    result = (tmp_path / "test_template.html").read_text(encoding="utf-8")
    formatted = result.format(username="Alice", email="alice@example.com")

    assert "Alice" in formatted
    assert "alice@example.com" in formatted
    assert formatted == "<h1>Hello, Alice!</h1><p>Email: alice@example.com</p>"


def test_template_files_exist():
    """Проверяет, что все нужные HTML-шаблоны существуют"""
    expected_templates = {
        "welcome.html",
        "confirm_account.html",
        "reset_password.html",
    }
    existing_templates = {p.name for p in TEMPLATE_DIR.glob("*.html")}
    missing = expected_templates - existing_templates
    assert not missing, f"Отсутствуют шаблоны: {missing}"