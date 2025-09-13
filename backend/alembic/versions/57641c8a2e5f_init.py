"""init

Revision ID: 57641c8a2e5f
Revises: 000_baseline
Create Date: 2025-09-13 11:10:09.524924

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa



revision: str = '57641c8a2e5f'
down_revision: Union[str, Sequence[str], None] = '000_baseline'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('lots', sa.Column('end_time', sa.DateTime(), nullable=True))
    op.add_column(
        'lots',
        sa.Column('is_forced_started', sa.Boolean(), nullable=False, server_default=sa.false())
    )


    op.alter_column('lots', 'is_forced_started', server_default=None)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('lots', 'is_forced_started')
    op.drop_column('lots', 'end_time')

